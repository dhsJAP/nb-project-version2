'use client'

import { useState} from 'react'
import Link from 'next/link'
import { Service } from '@/type'
import { BookingState } from '@/type'

// ─── Types ────────────────────────────────────────────────────────────────────




// ─── Constants ────────────────────────────────────────────────────────────────

// Giờ làm việc — true = còn trống (giả lập), false = đã đặt
const MOCK_BOOKED_SLOTS: Record<string, string[]> = {
  // 'YYYY-MM-DD': ['HH:MM', ...]
}
const WORK_HOURS = [
  '09:00', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30',
]

const MONTHS_VI = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
]
const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toISO(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

function formatDateVI(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay()
  return `${DAYS_VI[dow]}, ${d}/${m}/${y}`
}

function formatTime(t: string) {
  const [h, min] = t.split(':').map(Number)
  const ampm = h < 12 ? 'SA' : 'CH'
  const h12  = h % 12 || 12
  return `${h12}:${pad(min)} ${ampm}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Dịch vụ'   },
    { n: 2, label: 'Ngày & Giờ' },
    { n: 3, label: 'Thanh toán' },
    { n: 4, label: 'Xác nhận'  },
  ]
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                s.n < current
                  ? 'bg-rose-600 text-white'
                  : s.n === current
                  ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              {s.n < current ? '✓' : s.n}
            </div>
            <span
              className={`text-xs mt-1.5 hidden sm:block ${
                s.n === current ? 'text-rose-600 font-medium' : 'text-stone-400'
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-px mx-1 mb-5 transition-colors duration-300 ${
                s.n < current ? 'bg-rose-300' : 'bg-stone-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function ServiceCard({
  service,
  selected,
  onSelect,
}: {
  service: Service
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left relative rounded-2xl p-5 border-2 transition-all duration-200 ${
        selected
          ? 'border-rose-400 bg-rose-50 shadow-md shadow-rose-100'
          : 'border-stone-100 bg-white hover:border-rose-200 hover:shadow-sm'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs">
          ✓
        </div>
      )}
      <h3
        className="text-lg text-stone-800 mb-1"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        {service.name}
      </h3>
      <p className="text-xs text-stone-500 leading-relaxed mb-4">
        {service.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-400">⏱ {service.duration_minutes} phút</span>
        <span
          className="text-xl text-rose-600"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          ${service.price}
        </span>
      </div>
    </button>
  )
}

function MiniCalendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: string | null
  onSelect: (iso: string) => void
}) {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDow = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const isPast = (d: number) => {
    const cell = new Date(viewYear, viewMonth, d)
    cell.setHours(0,0,0,0)
    const tod = new Date(); tod.setHours(0,0,0,0)
    return cell < tod
  }

  const isSunday = (d: number) => new Date(viewYear, viewMonth, d).getDay() === 0

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-rose-50 border-b border-rose-100">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-full hover:bg-rose-100 flex items-center justify-center text-rose-600 text-sm transition-colors"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-stone-700">
          {MONTHS_VI[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-full hover:bg-rose-100 flex items-center justify-center text-rose-600 text-sm transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-3 pt-2">
        {DAYS_VI.map((d) => (
          <div key={d} className="text-center text-xs text-stone-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const iso      = toISO(viewYear, viewMonth, d)
          const past     = isPast(d)
          const sunday   = isSunday(d)
          const disabled = past || sunday
          const sel      = selectedDate === iso
          return (
            <button
              key={d}
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={`mx-auto w-8 h-8 rounded-full text-xs transition-all duration-150 flex items-center justify-center ${
                sel
                  ? 'bg-rose-600 text-white font-medium'
                  : disabled
                  ? 'text-stone-300 cursor-not-allowed'
                  : 'hover:bg-rose-50 text-stone-700 hover:text-rose-600'
              }`}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TimeSlots({
  selectedDate,
  selectedTime,
  onSelect,
}: {
  selectedDate: string | null
  selectedTime: string | null
  onSelect: (t: string) => void
}) {
  const booked = selectedDate ? (MOCK_BOOKED_SLOTS[selectedDate] ?? []) : []

  if (!selectedDate) {
    return (
      <div className="bg-white rounded-2xl border border-stone-100 p-6 flex items-center justify-center h-full min-h-[200px]">
        <p className="text-sm text-stone-400 text-center">
          ← Chọn ngày trên lịch<br />để xem giờ trống
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="px-4 py-3 bg-rose-50 border-b border-rose-100">
        <p className="text-xs font-medium text-stone-600">
          Giờ trống — {formatDateVI(selectedDate)}
        </p>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto">
        {WORK_HOURS.map((t) => {
          const isBooked = booked.includes(t)
          const isSel    = selectedTime === t
          return (
            <button
              key={t}
              disabled={isBooked}
              onClick={() => onSelect(t)}
              className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-between ${
                isSel
                  ? 'bg-rose-600 text-white'
                  : isBooked
                  ? 'bg-stone-50 text-stone-300 cursor-not-allowed'
                  : 'bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              <span>{formatTime(t)}</span>
              {isBooked && <span className="text-[10px] opacity-60">Đã đặt</span>}
              {isSel    && <span className="text-[10px] opacity-80">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SummaryBar({ state }: { state: BookingState }) {
  if (!state.service) return null
  return (
    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-3 text-center">
      <div>
        <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-0.5">Dịch vụ</p>
        <p className="text-xs font-medium text-stone-700 leading-tight">{state.service.name}</p>
      </div>
      <div>
        <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-0.5">Ngày & Giờ</p>
        <p className="text-xs font-medium text-stone-700 leading-tight">
          {state.date && state.time
            ? `${formatDateVI(state.date)} · ${formatTime(state.time)}`
            : '—'}
        </p>
      </div>
      <div>
        <p className="text-[10px] text-rose-400 uppercase tracking-widest mb-0.5">Tổng</p>
        <p
          className="text-sm font-semibold text-rose-600"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          ${state.service.price}
        </p>
      </div>
    </div>
  )
}

function InputField({
  label, id, type = 'text', placeholder, value, onChange, required = false,
}: {
  label: string; id: string; type?: string; placeholder?: string
  value: string; onChange: (v: string) => void; required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-stone-500 mb-1.5">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-700 bg-white focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-stone-300"
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingClient({ services }: { services: Service[] }) {
  const [step, setStep] = useState(1)
  const [state, setState] = useState<BookingState>({
    service:     null,
    date:        null,
    time:        null,
    paymentMode: 'deposit',
    name:        '',
    email:       '',
    phone:       '',
    cardNumber:  '',
    cardExpiry:  '',
    cardCvc:     '',
    cardName:    '',
    notes:       '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (patch: Partial<BookingState>) =>
    setState((prev) => ({ ...prev, ...patch }))

  const depositAmount = 15
  const payAmount = state.paymentMode === 'deposit'
    ? depositAmount
    : (state.service?.price ?? 0)

  // ── Step validation ──
  const canGoStep2 = !!state.service
  const canGoStep3 = !!state.service && !!state.date && !!state.time
  const canConfirm =
    canGoStep3 &&
    state.name.trim() &&
    state.email.trim() &&
    state.cardNumber.trim() &&
    state.cardExpiry.trim() &&
    state.cardCvc.trim()

  // ── Submit ──
  async function handleSubmit() {
    if (!canConfirm) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId:   state.service!.id,
          date:        state.date,
          time:        state.time,
          customerName:  state.name,
          customerEmail: state.email,
          customerPhone: state.phone,
          paymentMode: state.paymentMode,
          price:       state.service!.price,
          notes:       state.notes,
        }),
      })
      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg || 'Đã có lỗi xảy ra')
      }
      setStep(4)
   } catch (e: unknown) {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError(String(e));
   }
 }
}

  return (
    <div className="min-h-screen bg-[#fdf8f5]">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#fdf8f5]/90 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl text-rose-800 italic tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Trinh&apos;s Nails
          </Link>
          <Link href="/" className="text-sm text-stone-400 hover:text-rose-500 transition-colors">
            ← Trang chủ
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-12">

        {/* Page title */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-2">Đặt lịch</p>
          <h1
            className="text-4xl text-stone-800"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            {step === 4 ? 'Đặt Lịch Thành Công!' : 'Chọn Dịch Vụ Của Bạn'}
          </h1>
        </div>

        {/* Step indicator — ẩn ở bước 4 */}
        {step < 4 && <StepIndicator current={step} />}

        {/* Summary bar — hiện từ bước 2 trở đi */}
        {step >= 2 && step < 4 && <SummaryBar state={state} />}

        {/* ── STEP 1: Chọn dịch vụ ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  selected={state.service?.id === s.id}
                  onSelect={() => set({ service: s })}
                />
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => canGoStep2 && setStep(2)}
                disabled={!canGoStep2}
                className={`px-8 py-3.5 rounded-full text-sm font-medium transition-all ${
                  canGoStep2
                    ? 'bg-rose-600 hover:bg-rose-700 text-white hover:scale-[1.02]'
                    : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                }`}
              >
                Tiếp tục →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Chọn ngày & giờ ── */}
        {step === 2 && (
          <div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <MiniCalendar
                selectedDate={state.date}
                onSelect={(iso) => set({ date: iso, time: null })}
              />
              <TimeSlots
                selectedDate={state.date}
                selectedTime={state.time}
                onSelect={(t) => set({ time: t })}
              />
            </div>

            {/* Ghi chú */}
            <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-6">
              <label className="block text-xs text-stone-500 mb-1.5">
                Ghi chú cho thợ (tuỳ chọn)
              </label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Muốn làm hoa văn hoa anh đào, màu pastel..."
                value={state.notes}
                onChange={(e) => set({ notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-700 bg-white focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-stone-300 resize-none"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full text-sm text-stone-400 hover:text-rose-500 transition-colors"
              >
                ← Quay lại
              </button>
              <button
                onClick={() => canGoStep3 && setStep(3)}
                disabled={!canGoStep3}
                className={`px-8 py-3.5 rounded-full text-sm font-medium transition-all ${
                  canGoStep3
                    ? 'bg-rose-600 hover:bg-rose-700 text-white hover:scale-[1.02]'
                    : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                }`}
              >
                Tiếp tục →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Thông tin & Thanh toán ── */}
        {step === 3 && (
          <div className="space-y-5">

            {/* Thông tin khách */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5">
              <h2
                className="text-lg text-stone-700 mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
              >
                Thông tin khách hàng
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Họ và tên" id="name" placeholder="Nguyễn Thị Lan"
                  value={state.name} onChange={(v) => set({ name: v })} required
                />
                <InputField
                  label="Số điện thoại" id="phone" type="tel" placeholder="0901 234 567"
                  value={state.phone} onChange={(v) => set({ phone: v })}
                />
                <div className="sm:col-span-2">
                  <InputField
                    label="Email" id="email" type="email" placeholder="lan@email.com"
                    value={state.email} onChange={(v) => set({ email: v })} required
                  />
                </div>
              </div>
            </div>

            {/* Chọn thanh toán */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5">
              <h2
                className="text-lg text-stone-700 mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
              >
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {(['deposit', 'full'] as const).map((mode) => {
                  const isDeposit = mode === 'deposit'
                  const sel = state.paymentMode === mode
                  return (
                    <button
                      key={mode}
                      onClick={() => set({ paymentMode: mode })}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        sel
                          ? 'border-rose-400 bg-rose-50'
                          : 'border-stone-100 hover:border-rose-200'
                      }`}
                    >
                      <p className="text-sm font-medium text-stone-700 mb-0.5">
                        {isDeposit ? 'Đặt cọc' : 'Thanh toán đủ'}
                      </p>
                      <p
                        className="text-xl text-rose-600"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                      >
                        ${isDeposit ? depositAmount : state.service?.price}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-1 leading-tight">
                        {isDeposit
                          ? `Số còn lại $${(state.service?.price ?? 0) - depositAmount} thanh toán tại salon`
                          : 'Thanh toán toàn bộ ngay bây giờ'}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Card inputs */}
              <div className="space-y-3">
                <div className="bg-stone-50 rounded-xl p-4 space-y-3">
                  <p className="text-xs text-stone-400 mb-2 flex items-center gap-2">
                    <span>🔒</span> Thông tin thẻ được mã hoá bảo mật (Stripe)
                  </p>
                  <InputField
                    label="Số thẻ" id="cardNumber" placeholder="1234 5678 9012 3456"
                    value={state.cardNumber}
                    onChange={(v) => set({ cardNumber: v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19) })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="MM/YY" id="cardExpiry" placeholder="12/27"
                      value={state.cardExpiry}
                      onChange={(v) => {
                        const clean = v.replace(/\D/g,'').slice(0,4)
                        set({ cardExpiry: clean.length > 2 ? clean.slice(0,2)+'/'+clean.slice(2) : clean })
                      }}
                      required
                    />
                    <InputField
                      label="CVV" id="cardCvc" placeholder="123"
                      value={state.cardCvc}
                      onChange={(v) => set({ cardCvc: v.replace(/\D/g,'').slice(0,4) })}
                      required
                    />
                  </div>
                  <InputField
                    label="Tên trên thẻ" id="cardName" placeholder="NGUYEN THI LAN"
                    value={state.cardName}
                    onChange={(v) => set({ cardName: v.toUpperCase() })}
                  />
                </div>

                {/* Apple Pay / PayPal buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 py-3 rounded-xl border border-stone-200 text-xs text-stone-500 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                    <span>🍎</span> Apple Pay
                  </button>
                  <button className="flex-1 py-3 rounded-xl border border-stone-200 text-xs text-stone-500 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                    <span>🅿️</span> PayPal
                  </button>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5">
              <h2
                className="text-lg text-stone-700 mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
              >
                Tóm tắt đơn đặt
              </h2>
              <div className="space-y-2 text-sm">
                {[
                  ['Dịch vụ',  state.service?.name ?? '—'],
                  ['Ngày',     state.date ? formatDateVI(state.date) : '—'],
                  ['Giờ',      state.time ? formatTime(state.time)   : '—'],
                  ['Thợ',      'Trinh (Primary Artist)'],
                  ['Thời gian', `${state.service?.duration_minutes ?? '—'} phút`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-stone-50">
                    <span className="text-stone-400">{k}</span>
                    <span className="text-stone-700 font-medium text-right max-w-[60%]">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <span className="text-stone-700 font-medium">
                    {state.paymentMode === 'deposit' ? 'Đặt cọc ngay' : 'Thanh toán ngay'}
                  </span>
                  <span
                    className="text-rose-600 text-xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                  >
                    ${payAmount}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-full text-sm text-stone-400 hover:text-rose-500 transition-colors"
              >
                ← Quay lại
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canConfirm || loading}
                className={`px-8 py-3.5 rounded-full text-sm font-medium transition-all ${
                  canConfirm && !loading
                    ? 'bg-rose-600 hover:bg-rose-700 text-white hover:scale-[1.02]'
                    : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                }`}
              >
                {loading ? 'Đang xử lý...' : `XÁC NHẬN & THANH TOÁN $${payAmount}`}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Thành công ── */}
        {step === 4 && (
          <div className="text-center">
            {/* Checkmark animation */}
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6 text-3xl animate-bounce">
              ✓
            </div>

            <p className="text-stone-500 mb-8 leading-relaxed">
              Cảm ơn <strong>{state.name}</strong>! Lịch hẹn đã được xác nhận.<br />
              Email xác nhận đã được gửi đến <strong>{state.email}</strong>.
            </p>

            {/* Appointment card */}
            <div className="bg-white rounded-2xl border border-rose-100 p-6 text-left max-w-sm mx-auto mb-8">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-stone-100">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-lg">
                  💅
                </div>
                <div>
                  <p
                    className="text-base text-stone-800"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                  >
                    {state.service?.name}
                  </p>
                  <p className="text-xs text-stone-400">{state.service?.duration_minutes} phút</p>
                </div>
              </div>
              {[
                ['📅 Ngày',    state.date ? formatDateVI(state.date) : ''],
                ['🕐 Giờ',    state.time ? formatTime(state.time) : ''],
                ['👩‍🎨 Thợ',   'Trinh'],
                ['📍 Địa chỉ','148 Nguyễn Huy Tự, phường Bắc Hà, TP.Hà Tĩnh'],
                ['💳 Đã thanh toán', `$${payAmount}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-stone-50 text-sm last:border-0">
                  <span className="text-stone-400">{k}</span>
                  <span className="text-stone-700 font-medium text-right">{v}</span>
                </div>
              ))}
            </div>

            {/* Reminder */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 text-sm text-amber-700 text-left max-w-sm mx-auto mb-8 space-y-1">
              <p>⏰ Vui lòng đến trước <strong>5 phút</strong>.</p>
              <p>❌ Huỷ lịch ít nhất <strong>24 giờ</strong> trước để được hoàn cọc.</p>
              <p>📞 Liên hệ: <strong>091 255 4570</strong></p>
            </div>

            <div className="flex gap-3 justify-center">
              <Link
                href="/"
                className="px-6 py-3 rounded-full border border-rose-200 text-rose-600 text-sm hover:bg-rose-50 transition-colors"
              >
                Về trang chủ
              </Link>
              <button
                onClick={() => {
                  setStep(1)
                  setState({
                    service:null,date:null,time:null,paymentMode:'deposit',
                    name:'',email:'',phone:'',cardNumber:'',cardExpiry:'',
                    cardCvc:'',cardName:'',notes:'',
                  })
                }}
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm transition-colors"
              >
                Đặt lịch mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

