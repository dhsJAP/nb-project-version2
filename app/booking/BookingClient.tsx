'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Service, ServiceItem, StaffMember } from '@/type'

type PaymentMode = 'deposit' | 'full'

type BookingFormState = {
  date: string | null
  time: string | null
  staffId: string | null
  paymentMode: PaymentMode
  name: string
  email: string
  phone: string
  cardNumber: string
  cardExpiry: string
  cardCvc: string
  cardName: string
  notes: string
}

const MOCK_BOOKED_SLOTS: Record<string, string[]> = {}
const WORK_HOURS = [
  '09:00', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30',
]

function pad(n: number) { return String(n).padStart(2, '0') }
function toISO(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}` }
function formatTime(t: string) {
  const [h, min] = t.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 || 12
  return `${h12}:${pad(min)} ${ampm}`
}
function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d}/${m}/${y}`
}

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Services' },
    { n: 2, label: 'Staff' },
    { n: 3, label: 'Date & Time' },
    { n: 4, label: 'Payment' },
    { n: 5, label: 'Done' },
  ]
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${s.n < current ? 'bg-rose-600 text-white' : s.n === current ? 'bg-rose-600 text-white ring-4 ring-rose-100' : 'bg-stone-100 text-stone-400'}`}>
              {s.n < current ? '✓' : s.n}
            </div>
            <span className={`text-xs mt-1.5 hidden sm:block ${s.n === current ? 'text-rose-600 font-medium' : 'text-stone-400'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`w-12 sm:w-20 h-px mx-1 mb-5 ${s.n < current ? 'bg-rose-300' : 'bg-stone-200'}`} />}
        </div>
      ))}
    </div>
  )
}

function ServiceGroupCard({ service, selectedCount, onOpen }: { service: Service; selectedCount: number; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="w-full text-left rounded-2xl p-5 border-2 border-stone-100 bg-white hover:border-rose-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg text-stone-800 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{service.name}</h3>
          <p className="text-xs text-stone-500 leading-relaxed mb-4">{service.description}</p>
        </div>
        {selectedCount > 0 && <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700">{selectedCount} selected</span>}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-400">{service.duration_minutes} min</span>
        <span className="text-xs text-rose-500 uppercase tracking-wide">Click for details</span>
      </div>
    </button>
  )
}

function ServicesModal({ service, items, selectedItemIds, onToggleItem, onClose }: { service: Service; items: ServiceItem[]; selectedItemIds: Set<string>; onToggleItem: (itemId: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-white border border-rose-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-rose-100 flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[2px] uppercase text-rose-400">Service Details</p>
            <h3 className="text-xl text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{service.name}</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-rose-500">Close</button>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto max-h-[60vh]">
          {items.map((item) => {
            const checked = selectedItemIds.has(item.id)
            return (
              <button key={item.id} onClick={() => onToggleItem(item.id)} className={`w-full text-left rounded-xl border p-3 ${checked ? 'border-rose-300 bg-rose-50' : 'border-stone-100 hover:border-rose-200'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-stone-700 font-medium">{item.name}</p>
                    {item.description && <p className="text-xs text-stone-400 mt-0.5">{item.description}</p>}
                  </div>
                  <div className="text-right">
                    {item.price !== null && <p className="text-sm text-rose-600 font-medium">${item.price}</p>}
                    {item.duration_minutes !== null && <p className="text-[11px] text-stone-400">{item.duration_minutes}m</p>}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MiniCalendar({ selectedDate, onSelect }: { selectedDate: string | null; onSelect: (iso: string) => void }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const firstDow = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-rose-50 border-b border-rose-100">
        <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) } else setViewMonth((m) => m - 1) }} className="w-7 h-7 rounded-full border border-rose-200 bg-white text-rose-600 hover:bg-rose-100 transition-colors">‹</button>
        <span className="text-sm font-medium text-stone-700">{viewMonth + 1}/{viewYear}</span>
        <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) } else setViewMonth((m) => m + 1) }} className="w-7 h-7 rounded-full border border-rose-200 bg-white text-rose-600 hover:bg-rose-100 transition-colors">›</button>
      </div>
      <div className="grid grid-cols-7 px-3 pt-2 text-center text-xs text-stone-400">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => <div key={d} className="py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const iso = toISO(viewYear, viewMonth, d)
          const cell = new Date(viewYear, viewMonth, d); cell.setHours(0, 0, 0, 0)
          const now = new Date(); now.setHours(0, 0, 0, 0)
          const disabled = cell < now || cell.getDay() === 0
          const selected = selectedDate === iso
          return <button key={d} disabled={disabled} onClick={() => onSelect(iso)} className={`mx-auto w-8 h-8 rounded-full text-xs ${selected ? 'bg-rose-600 text-white' : disabled ? 'text-stone-300' : 'hover:bg-rose-50 text-stone-700'}`}>{d}</button>
        })}
      </div>
    </div>
  )
}

function TimeSlots({ selectedDate, selectedTime, onSelect }: { selectedDate: string | null; selectedTime: string | null; onSelect: (t: string) => void }) {
  const booked = selectedDate ? (MOCK_BOOKED_SLOTS[selectedDate] ?? []) : []
  if (!selectedDate) return <div className="bg-white rounded-2xl border border-stone-100 p-6 flex items-center justify-center min-h-[200px]"><p className="text-sm text-stone-400">Select a date first</p></div>
  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="px-4 py-3 bg-rose-50 border-b border-rose-100"><p className="text-xs font-medium text-stone-600">Available time - {formatDate(selectedDate)}</p></div>
      <div className="p-3 grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto">
        {WORK_HOURS.map((t) => {
          const isBooked = booked.includes(t)
          const isSel = selectedTime === t
          return <button key={t} disabled={isBooked} onClick={() => onSelect(t)} className={`py-2.5 px-3 rounded-xl text-xs font-medium ${isSel ? 'bg-rose-600 text-white' : isBooked ? 'bg-stone-50 text-stone-300' : 'bg-stone-50 text-stone-600 hover:bg-rose-50'}`}>{formatTime(t)}</button>
        })}
      </div>
    </div>
  )
}

export default function BookingClient({ services, serviceItems, staff }: { services: Service[]; serviceItems: ServiceItem[]; staff: StaffMember[] }) {
  const searchParams = useSearchParams()
  const initialItemId = searchParams.get('itemId')
  const initialServiceId = searchParams.get('serviceId')

  const [step, setStep] = useState(1)
  const [openServiceId, setOpenServiceId] = useState<string | null>(initialServiceId)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(initialItemId ? [initialItemId] : [])
  const [form, setForm] = useState<BookingFormState>({ date: null, time: null, staffId: null, paymentMode: 'deposit', name: '', email: '', phone: '', cardNumber: '', cardExpiry: '', cardCvc: '', cardName: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const serviceById = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s])), [services])
  const itemsByServiceId = useMemo(() => serviceItems.reduce<Record<string, ServiceItem[]>>((acc, item) => { const list = acc[item.service_id] ?? []; list.push(item); acc[item.service_id] = list; return acc }, {}), [serviceItems])
  const itemById = useMemo(() => Object.fromEntries(serviceItems.map((i) => [i.id, i])), [serviceItems])
  const selectedItems = useMemo(() => selectedItemIds.map((id) => itemById[id]).filter(Boolean), [selectedItemIds, itemById])
  const groupedSelection = useMemo(() => selectedItems.reduce<Record<string, ServiceItem[]>>((acc, item) => { const list = acc[item.service_id] ?? []; list.push(item); acc[item.service_id] = list; return acc }, {}), [selectedItems])

  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price ?? 0), 0)
  const totalDuration = selectedItems.reduce((sum, item) => sum + (item.duration_minutes ?? 0), 0)
  const payAmount = form.paymentMode === 'deposit' ? Math.round(totalPrice * 0.3) : totalPrice

  const toggleItem = (itemId: string) => setSelectedItemIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  const canGoStep2 = selectedItemIds.length > 0
  const canGoStep3 = canGoStep2 && !!form.staffId
  const canGoStep4 = canGoStep3 && !!form.date && !!form.time
  const canConfirm = canGoStep4 && !!form.name.trim() && !!form.email.trim() && !!form.cardNumber.trim() && !!form.cardExpiry.trim() && !!form.cardCvc.trim()

  async function handleSubmit() {
    if (!canConfirm) return
    setLoading(true); setError('')
    try {
      const primaryItem = selectedItems[0]
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serviceId: primaryItem?.service_id, serviceItemIds: selectedItemIds, staffId: form.staffId, date: form.date, time: form.time, customerName: form.name, customerEmail: form.email, customerPhone: form.phone, paymentMode: form.paymentMode, price: totalPrice, notes: form.notes }) })
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.error || 'Something went wrong') }
      setStep(5)
    } catch (e) { setError(e instanceof Error ? e.message : String(e)) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#fdf8f5]">
      <header className="sticky top-0 z-40 bg-[#fdf8f5]/90 backdrop-blur-sm border-b border-rose-100"><div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between"><Link href="/" className="text-2xl text-rose-800 italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Trinh&apos;s Nails</Link><Link href="/" className="text-sm text-stone-400 hover:text-rose-500">Home</Link></div></header>
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="text-center mb-10"><p className="text-xs tracking-[4px] text-rose-400 uppercase mb-2">Booking</p><h1 className="text-4xl text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{step === 5 ? 'Booking Confirmed!' : 'Select Your Services'}</h1></div>
        {step < 5 && <StepIndicator current={step} />}

        {step === 1 && <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">{services.map((s) => <ServiceGroupCard key={s.id} service={s} selectedCount={(groupedSelection[s.id] ?? []).length} onOpen={() => setOpenServiceId(s.id)} />)}</div>
          <div className="bg-white rounded-2xl border border-rose-100 p-4">
            <p className="text-xs tracking-[2px] uppercase text-rose-400 mb-2">Selected services</p>
            {Object.keys(groupedSelection).length === 0 && <p className="text-sm text-stone-400">No service selected yet.</p>}
            <div className="space-y-3">{Object.entries(groupedSelection).map(([serviceId, items]) => <div key={serviceId} className="border border-stone-100 rounded-xl p-3"><p className="text-sm font-medium text-stone-700 mb-2">{serviceById[serviceId]?.name ?? 'Service group'}</p><div className="space-y-2">{items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 text-sm"><span className="text-stone-600">{item.name}</span><button onClick={() => toggleItem(item.id)} className="text-rose-500 hover:text-rose-700">Delete</button></div>)}</div></div>)}</div>
          </div>
          <div className="pt-2 flex justify-end"><button onClick={() => canGoStep2 && setStep(2)} disabled={!canGoStep2} className={`px-8 py-3.5 rounded-full text-sm font-medium ${canGoStep2 ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-stone-100 text-stone-300'}`}>Continue</button></div>
        </div>}

        {step === 2 && <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <h2 className="text-lg text-stone-700 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>Choose Your Staff</h2>
            <div className="grid grid-cols-5 gap-4">
              {staff.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setForm((prev) => ({ ...prev, staffId: member.id }))}
                  onDoubleClick={() => canGoStep3 && setStep(3)}
                  className={`text-left rounded-2xl border-2 p-3 transition-all ${form.staffId === member.id ? 'border-rose-400 bg-rose-50' : 'border-stone-100 hover:border-rose-200'}`}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
                    <Image src={member.image_url || '/images/boss.png'} alt={member.name} fill className="object-cover" />
                  </div>
                  <p className="text-sm text-stone-800 font-medium">{member.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{member.role}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-6 py-3 rounded-full text-sm text-stone-400 border border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-colors">Back</button>
            <button onClick={() => canGoStep3 && setStep(3)} disabled={!canGoStep3} className={`px-8 py-3.5 rounded-full text-sm font-medium ${canGoStep3 ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-stone-100 text-stone-300'}`}>Continue</button>
          </div>
        </div>}

        {step === 3 && <div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6">
            <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-1">Services</p>
            <div className="space-y-2">
              {Object.entries(groupedSelection).map(([serviceId, items]) => (
                <div key={serviceId}>
                  <p className="text-sm text-stone-700 font-medium">{serviceById[serviceId]?.name ?? 'Service'}</p>
                  <div className="mt-0.5 space-y-0.5">
                    {items.map((item) => (
                      <p key={item.id} className="text-sm text-stone-600">- {item.name}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {form.staffId && (
              <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-1 mt-4">Staff</p>
            )}
            {form.staffId && (
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-stone-100">
                  <Image src={staff.find((member) => member.id === form.staffId)?.image_url || '/images/boss.png'} alt={staff.find((member) => member.id === form.staffId)?.name || 'Staff member'} fill className="object-cover" />
                </div>
                <p className="text-sm text-stone-600">{staff.find((member) => member.id === form.staffId)?.name}</p>
              </div>
            )}
          </div>         
          <div className="grid sm:grid-cols-2 gap-4 mb-6"><MiniCalendar selectedDate={form.date} onSelect={(iso) => setForm((prev) => ({ ...prev, date: iso, time: null }))} /><TimeSlots selectedDate={form.date} selectedTime={form.time} onSelect={(t) => setForm((prev) => ({ ...prev, time: t }))} /></div>
          <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-6"><label className="block text-xs text-stone-500 mb-1.5">Notes (optional)</label><textarea rows={3} value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm placeholder:font-semibold placeholder:text-stone-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors" /></div>
          <div className="flex justify-between"><button onClick={() => setStep(2)} className="px-6 py-3 rounded-full text-sm text-stone-400 border border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-colors">Back</button><button onClick={() => canGoStep4 && setStep(4)} disabled={!canGoStep4} className={`px-8 py-3.5 rounded-full text-sm font-medium ${canGoStep4 ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-stone-100 text-stone-300'}`}>Continue</button></div>
        </div>}

        {step === 4 && <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-stone-100 p-5"><h2 className="text-lg text-stone-700 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>Customer Info</h2><div className="grid sm:grid-cols-2 gap-4"><input placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="px-4 py-3 rounded-xl border border-stone-200 text-sm text-black placeholder:font-medium placeholder:text-stone-300 focus:placeholder-transparent focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors" /><input placeholder="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="px-4 py-3 rounded-xl border border-stone-200 text-sm text-black placeholder:font-medium placeholder:text-stone-300 focus:placeholder-transparent focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors" /><input placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="sm:col-span-2 px-4 py-3 rounded-xl border border-stone-200 text-sm text-black placeholder:font-medium placeholder:text-stone-300 focus:placeholder-transparent focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors" /></div></div>
          <div className="bg-white rounded-2xl border border-stone-100 p-5"><h2 className="text-lg text-stone-700 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>Payment</h2><div className="grid grid-cols-2 gap-3 mb-5">{(['deposit', 'full'] as const).map((mode) => <button key={mode} onClick={() => setForm((p) => ({ ...p, paymentMode: mode }))} className={`p-4 rounded-xl border-2 text-left ${form.paymentMode === mode ? 'border-rose-400 bg-rose-50' : 'border-stone-100'}`}><p className="text-sm font-medium text-stone-700 mb-0.5">{mode === 'deposit' ? 'Deposit' : 'Pay full'}</p><p className="text-xl text-rose-600" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>${mode === 'deposit' ? Math.round(totalPrice * 0.3) : totalPrice}</p></button>)}</div><div className="space-y-3"><input placeholder="Card number" value={form.cardNumber} onChange={(e) => setForm((p) => ({ ...p, cardNumber: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-black placeholder:font-medium placeholder:text-stone-300 focus:placeholder-transparent focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors" /><div className="grid grid-cols-2 gap-3"><input placeholder="MM/YY" value={form.cardExpiry} onChange={(e) => setForm((p) => ({ ...p, cardExpiry: e.target.value }))} className="px-4 py-3 rounded-xl border border-stone-200 text-sm text-black placeholder:font-medium placeholder:text-stone-300 focus:placeholder-transparent focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors" /><input placeholder="CVV" value={form.cardCvc} onChange={(e) => setForm((p) => ({ ...p, cardCvc: e.target.value }))} className="px-4 py-3 rounded-xl border border-stone-200 text-sm text-black placeholder:font-medium placeholder:text-stone-300 focus:placeholder-transparent focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors" /></div><input placeholder="Name on card" value={form.cardName} onChange={(e) => setForm((p) => ({ ...p, cardName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-black placeholder:font-medium placeholder:text-stone-300 focus:placeholder-transparent focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-colors" /></div></div>
          <div className="bg-white rounded-2xl border border-stone-100 p-5"><h2 className="text-lg text-stone-700 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>Booking Summary</h2><div className="space-y-2 text-sm"><div className="flex justify-between py-1.5 border-b border-stone-50"><span className="text-stone-400">Services</span><span className="text-stone-700 font-medium text-right max-w-[60%]">{selectedItems.map((i) => i.name).join(', ') || '�'}</span></div><div className="flex justify-between py-1.5 border-b border-stone-50"><span className="text-stone-400">Day</span><span className="text-stone-700 font-medium">{form.date ? formatDate(form.date) : '�'}</span></div><div className="flex justify-between py-1.5 border-b border-stone-50"><span className="text-stone-400">Time slot</span><span className="text-stone-700 font-medium">{form.time ? formatTime(form.time) : '�'}</span></div><div className="flex justify-between py-1.5 border-b border-stone-50"><span className="text-stone-400">Duration</span><span className="text-stone-700 font-medium">{totalDuration} min</span></div><div className="flex justify-between pt-2"><span className="text-stone-700 font-medium">{form.paymentMode === 'deposit' ? 'Pay now' : 'Total'}</span><span className="text-rose-600 text-xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>${payAmount}</span></div></div></div>
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
          <div className="flex justify-between pt-2"><button onClick={() => setStep(3)} className="px-6 py-3 rounded-full text-sm text-stone-400 border border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-colors">Back</button><button onClick={handleSubmit} disabled={!canConfirm || loading} className={`px-8 py-3.5 rounded-full text-sm font-medium ${canConfirm && !loading ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-stone-100 text-stone-300'}`}>{loading ? 'Processing...' : `CONFIRM $${payAmount}`}</button></div>
        </div>}

        {step === 5 && (
  <div className="text-center">
    <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6 text-3xl">
      ✓
    </div>

    <p className="text-stone-500 mb-8 leading-relaxed">
      Thank you <strong>{form.name}</strong>. Your booking has been confirmed.
    </p>

    <div className="bg-white rounded-2xl border border-rose-100 p-6 text-left max-w-sm mx-auto mb-8">
      <p className="text-sm text-stone-700 mb-2">Services:</p>

      <div className="space-y-2">
        {Object.entries(groupedSelection).map(([serviceId, items]) => (
          <div key={serviceId}>
            <p className="text-sm text-stone-700 font-medium">
              {serviceById[serviceId]?.name ?? "Service"}
            </p>

            <div className="mt-0.5 space-y-0.5 pl-4">
              {items.map((item) => (
                <p key={item.id} className="text-sm text-stone-600">
                  {item.name}
                </p>
              ))}
            </div>
          </div>
          ))}
      </div>

      <p className="text-xs text-stone-500 mt-3">
        Staff: {staff.find((member) => member.id === form.staffId)?.name ?? "-"}
      </p>

      <p className="text-xs text-stone-500 mt-1">
        Date: {form.date ? formatDate(form.date) : "-"}
      </p>

      <p className="text-xs text-stone-500">
        Time: {form.time ? formatTime(form.time) : "-"}
      </p>
    </div>

    <div className="flex gap-3 justify-center">
      <Link
        href="/"
        className="px-6 py-3 rounded-full border border-rose-200 text-rose-600 text-sm hover:bg-rose-50"
      >
        Home
      </Link>

      <button
        onClick={() => {
          setStep(1)
          setSelectedItemIds([])

          setForm({
            date: null,
            time: null,
            staffId: null,
            paymentMode: "deposit",
            name: "",
            email: "",
            phone: "",
            cardNumber: "",
            cardExpiry: "",
            cardCvc: "",
            cardName: "",
            notes: "",
          })
        }}
        className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm"
      >
        New booking
      </button>
    </div>
  </div>
)}

{openServiceId && serviceById[openServiceId] && (
  <ServicesModal
    service={serviceById[openServiceId]}
    items={itemsByServiceId[openServiceId] ?? []}
    selectedItemIds={new Set(selectedItemIds)}
    onToggleItem={toggleItem}
    onClose={() => setOpenServiceId(null)}
  />
)}
      </div>
    </div>
  )
}