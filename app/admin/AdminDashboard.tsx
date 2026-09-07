'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { STAFF_MEMBERS } from '@/constants/staff'

type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'
type Tab = 'overview' | 'bookings' | 'calendar'

type Booking = {
  id: string
  customer: string
  email: string
  service: string
  stylist: string
  stylistId: string
  date: string
  time: string
  duration: number
  price: number
  status: BookingStatus
  payment: 'Paid' | 'Deposit' | 'Due'
}

type RawBookingRecord = {
  id: string
  customer_name: string | null
  customer_email: string | null
  service_id: string | null
  staff_id: string | null
  booking_date: string | null
  booking_time: string | null
  status: string | null
  payment_mode: string | null
  notes: string | null
}

const today = new Date()
const iso = (offset: number) => {
  const value = new Date(today)
  value.setDate(value.getDate() + offset)
  return value.toISOString().slice(0, 10)
}

const statusLabels: Record<BookingStatus, string> = { confirmed: 'Confirmed', pending: 'Pending', completed: 'Completed', cancelled: 'Cancelled' }

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    close: <><path d="M6 6l12 12M18 6 6 18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

function StatusPill({ status }: { status: BookingStatus }) {
  return <span className={`status-pill status-${status}`}><span className="status-dot" />{statusLabels[status]}</span>
}

function StatCard({ label, value, detail, tone, icon }: { label: string; value: string; detail: string; tone: string; icon: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon name={icon} /></div><div><p className="stat-label">{label}</p><p className="stat-value">{value}</p><p className="stat-detail">{detail}</p></div></div>
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all')
  const [stylistFilter, setStylistFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(iso(0))
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadBookings() {
      try {
        setLoading(true)
        setLoadError('')

        const supabase = getSupabase()
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('id, customer_name, customer_email, service_id, staff_id, booking_date, booking_time, status, payment_mode, notes')
          .order('booking_date', { ascending: true })
          .order('booking_time', { ascending: true })

        if (bookingsError) throw new Error(bookingsError.message)

        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name, price, duration_minutes')

        if (servicesError) throw new Error(servicesError.message)

        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('id, name')

        if (staffError) throw new Error(staffError.message)

        const serviceById = Object.fromEntries((servicesData ?? []).map((service) => [service.id, service]))
        const staffById = Object.fromEntries((staffData ?? []).map((member) => [member.id, member]))

        const mappedBookings: Booking[] = ((bookingsData ?? []) as RawBookingRecord[]).map((item) => {
          const service = serviceById[item.service_id ?? ''] as { name?: string; price?: number; duration_minutes?: number } | undefined
          const staff = staffById[item.staff_id ?? ''] as { name?: string } | undefined

          const normalizedStatus: BookingStatus =
            item.status === 'confirmed' || item.status === 'pending' || item.status === 'completed' || item.status === 'cancelled'
              ? item.status
              : 'pending'

          const payment = item.payment_mode === 'full' ? 'Paid' : item.payment_mode === 'deposit' ? 'Deposit' : 'Due'
          const bookingDate = item.booking_date ?? iso(0)

          return {
            id: item.id,
            customer: item.customer_name || 'Unknown customer',
            email: item.customer_email || '',
            service: service?.name ?? 'Custom service',
            stylist: staff?.name ?? 'Unassigned',
            stylistId: item.staff_id ?? '',
            date: bookingDate,
            time: item.booking_time?.slice(0, 5) ?? '00:00',
            duration: service?.duration_minutes ?? 60,
            price: service?.price ?? 0,
            status: normalizedStatus,
            payment,
          }
        })

        if (isMounted) {
          setBookings(mappedBookings)
        }
      } catch (error) {
        console.error('Failed to load bookings from Supabase:', error)
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load bookings')
          setBookings([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadBookings()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const matchesQuery = `${booking.customer} ${booking.id} ${booking.service}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (statusFilter === 'all' || booking.status === statusFilter) && (stylistFilter === 'all' || booking.stylistId === stylistFilter)
  }), [bookings, query, statusFilter, stylistFilter])

  const selectedBooking = bookings.find((booking) => booking.id === rescheduleId)

  async function updateStatus(id: string, status: BookingStatus) {
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Failed to update booking status')
      }

      setBookings((items) => items.map((item) => item.id === id ? { ...item, status } : item))
      setToast(`Booking ${id} updated to ${statusLabels[status].toLowerCase()}`)
      window.setTimeout(() => setToast(''), 2600)
    } catch (error) {
      console.error('Failed to update booking status:', error)
      setToast(error instanceof Error ? error.message : 'Unable to update booking status')
      window.setTimeout(() => setToast(''), 3200)
    }
  }

  async function reschedule(id: string, date: string, time: string) {
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ id, date, time }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'Failed to reschedule booking')
      }

      setBookings((items) => items.map((item) => item.id === id ? { ...item, date, time, status: 'confirmed' } : item))
      setRescheduleId(null)
      setToast(`Booking ${id} has been rescheduled`)
      window.setTimeout(() => setToast(''), 2600)
    } catch (error) {
      console.error('Failed to reschedule booking:', error)
      setToast(error instanceof Error ? error.message : 'Unable to reschedule booking')
      window.setTimeout(() => setToast(''), 3200)
    }
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="brand-lockup"><div className="brand-mark">T</div><div><p className="brand-name">Trinh&apos;s Nails</p><p className="brand-sub">Admin workspace</p></div></div>
      <div className="sidebar-section-label">Workspace</div>
      <nav className="admin-nav">
        {([['overview', 'Overview', 'grid'], ['bookings', 'Bookings', 'calendar'], ['calendar', 'Stylist calendar', 'users']] as const).map(([tab, label, icon]) => <button key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}><Icon name={icon} /><span>{label}</span>{tab === 'bookings' && <span className="nav-count">{bookings.length}</span>}</button>)}
      </nav>
      <div className="sidebar-bottom"><div className="help-card"><p>Need a hand?</p><span>Visit the help center</span><Icon name="arrow" size={15} /></div><Link className="back-home" href="/"><span>←</span> Back to website</Link><div className="admin-profile"><div className="profile-avatar">TC</div><div><p>Trinh Con</p><span>Administrator</span></div><Icon name="chevron" size={15} /></div></div>
    </aside>

    <main className="admin-main">
      <header className="admin-topbar"><div className="mobile-brand"><div className="brand-mark">T</div><span>Trinh&apos;s Nails</span></div><div className="topbar-actions"><button className="icon-button notification"><Icon name="bell" /><i /></button><div className="topbar-user"><div className="profile-avatar">TC</div><span>Trinh Con</span><Icon name="chevron" size={14} /></div></div></header>
      <div className="admin-content">
        <div className="page-heading"><div><p className="eyebrow">Tuesday, July 21, 2026</p><h1>{activeTab === 'calendar' ? 'Stylist calendar' : activeTab === 'bookings' ? 'All bookings' : 'Good morning, Trinh'}</h1><p className="heading-copy">{activeTab === 'overview' ? 'Here&apos;s what is happening at your salon today.' : activeTab === 'bookings' ? 'Manage appointments and keep your team on schedule.' : 'See each stylist&apos;s appointments at a glance.'}</p></div><button className="primary-button" onClick={() => setActiveTab('bookings')}><span>+</span> New booking</button></div>

        {activeTab === 'overview' && <><div className="stats-grid"><StatCard label="Today&apos;s bookings" value="12" detail="↑ 8.2% from last Tuesday" tone="pink" icon="calendar" /><StatCard label="Pending requests" value="4" detail="Needs your attention" tone="peach" icon="clock" /><StatCard label="Total revenue" value="$846" detail="↑ 12.4% from last week" tone="lavender" icon="grid" /><StatCard label="Active stylists" value="3 / 3" detail="Everyone is available" tone="mint" icon="users" /></div><section className="dashboard-grid"><div className="panel upcoming-panel"><div className="panel-heading"><div><h2>Upcoming appointments</h2><p>Today, {formatDate(iso(0))}</p></div><button className="text-button" onClick={() => setActiveTab('bookings')}>View all <Icon name="arrow" size={15} /></button></div>{loading ? <div className="empty-state">Loading bookings…</div> : <div className="appointment-list">{bookings.filter((b) => b.date === iso(0)).map((booking) => <AppointmentRow key={booking.id} booking={booking} onReschedule={setRescheduleId} />)}</div>}</div><div className="panel mini-calendar-panel"><div className="panel-heading"><div><h2>July 2026</h2><p>Monthly overview</p></div><button className="round-button">•••</button></div><MiniMonth selectedDate={selectedDate} bookings={bookings} onSelect={setSelectedDate} /><div className="calendar-legend"><span><i className="legend-pink" />Booked</span><span><i className="legend-dot" />Today</span></div></div></section><section className="panel stylist-panel"><div className="panel-heading"><div><h2>Your stylists</h2><p>Today&apos;s workload</p></div><button className="text-button" onClick={() => setActiveTab('calendar')}>Open calendar <Icon name="arrow" size={15} /></button></div><div className="stylist-grid">{STAFF_MEMBERS.map((staff) => <StylistCard key={staff.id} staff={staff} bookings={bookings.filter((b) => b.stylistId === staff.id && b.date === iso(0))} />)}</div></section></>}

        {(activeTab === 'bookings' || activeTab === 'calendar') && <section className="panel bookings-panel"><div className="panel-heading booking-heading"><div><h2>{activeTab === 'calendar' ? 'Schedule by stylist' : 'Booking requests'}</h2><p>{activeTab === 'calendar' ? 'Select a day to see the team schedule.' : `${filteredBookings.length} appointments in your workspace`}</p></div><div className="view-toggle"><button className={activeTab === 'bookings' ? 'selected' : ''} onClick={() => setActiveTab('bookings')}><Icon name="calendar" size={15} /> List</button><button className={activeTab === 'calendar' ? 'selected' : ''} onClick={() => setActiveTab('calendar')}><Icon name="users" size={15} /> Calendar</button></div></div>{loadError && <div className="empty-state" style={{ color: '#b91c1c', marginBottom: 12 }}>{loadError}</div>}{activeTab === 'bookings' ? <><div className="filter-bar"><div className="search-box"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by customer or booking ID" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><select value={stylistFilter} onChange={(event) => setStylistFilter(event.target.value)}><option value="all">All stylists</option>{STAFF_MEMBERS.map((staff) => <option key={staff.id} value={staff.id}>{staff.name}</option>)}</select></div>{loading ? <div className="empty-state">Loading bookings from Supabase…</div> : <BookingTable bookings={filteredBookings} onStatus={updateStatus} onReschedule={setRescheduleId} />}</> : <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} bookings={bookings} onReschedule={setRescheduleId} />}</section>}
      </div>
    </main>
    {selectedBooking && <RescheduleModal booking={selectedBooking} onClose={() => setRescheduleId(null)} onSave={reschedule} />}
    {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={14} /></span>{toast}</div>}
  </div>
}

function AppointmentRow({ booking, onReschedule }: { booking: Booking; onReschedule: (id: string) => void }) { return <div className="appointment-row"><div className="appointment-time"><b>{booking.time}</b><span>{booking.duration} min</span></div><div className="appointment-line" /><div className="appointment-info"><div className="customer-avatar">{booking.customer.split(' ').map((n) => n[0]).join('')}</div><div><p>{booking.customer}</p><span>{booking.service} · {booking.stylist}</span></div></div><StatusPill status={booking.status} /><button className="row-action" onClick={() => onReschedule(booking.id)}>Manage</button></div> }

function BookingTable({ bookings, onStatus, onReschedule }: { bookings: Booking[]; onStatus: (id: string, status: BookingStatus) => void; onReschedule: (id: string) => void }) { return <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Appointment</th><th>Stylist</th><th>Payment</th><th>Status</th><th /></tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id}><td><div className="table-customer"><div className="customer-avatar">{booking.customer.split(' ').map((n) => n[0]).join('')}</div><div><b>{booking.customer}</b><span>{booking.id} · {booking.email}</span></div></div></td><td><b>{formatDate(booking.date)}</b><span>{booking.time} · {booking.duration} min</span></td><td>{booking.stylist}</td><td><span className={`payment payment-${booking.payment.toLowerCase()}`}>{booking.payment}</span><b>${booking.price}</b></td><td><select className={`status-select select-${booking.status}`} value={booking.status} onChange={(event) => onStatus(booking.id, event.target.value as BookingStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td><td><button className="manage-button" onClick={() => onReschedule(booking.id)}>Manage</button></td></tr>)}{bookings.length === 0 && <tr><td colSpan={6}><div className="empty-state">No bookings match your filters.</div></td></tr>}</tbody></table></div> }

function StylistCard({ staff, bookings }: { staff: typeof STAFF_MEMBERS[number]; bookings: Booking[] }) { return <div className="stylist-card"><div className="stylist-card-head"><div className="stylist-person"><div className="staff-image"><Image src={staff.image_url || '/images/boss.png'} alt={staff.name} fill className="object-cover" /></div><div><b>{staff.name}</b><span>{staff.role.split(' / ')[0]}</span></div></div><span className="available-dot">Available</span></div><div className="workload"><div><span>{bookings.length} appointments</span><b>{bookings.reduce((sum, item) => sum + item.duration, 0)} min booked</b></div><div className="workload-bar"><i style={{ width: `${Math.min(100, bookings.reduce((sum, item) => sum + item.duration, 0) / 4)}%` }} /></div></div></div> }

function MiniMonth({ selectedDate, bookings, onSelect }: { selectedDate: string; bookings: Booking[]; onSelect: (date: string) => void }) { const year = today.getFullYear(); const month = today.getMonth(); const first = new Date(year, month, 1).getDay(); const count = new Date(year, month + 1, 0).getDate(); return <div className="month-grid"><div className="weekdays">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div><div className="month-days">{Array.from({ length: first }).map((_, index) => <i key={`blank-${index}`} />)}{Array.from({ length: count }, (_, index) => index + 1).map((day) => { const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; const hasBookings = bookings.some((booking) => booking.date === date && booking.status !== 'cancelled'); return <button key={day} className={`${date === selectedDate ? 'selected' : ''} ${date === iso(0) ? 'today' : ''}`} onClick={() => onSelect(date)}>{day}{hasBookings && <i />}</button> })}</div></div> }

function CalendarView({ selectedDate, setSelectedDate, bookings, onReschedule }: { selectedDate: string; setSelectedDate: (date: string) => void; bookings: Booking[]; onReschedule: (id: string) => void }) { const dates = [0, 1, 2, 3, 4].map((offset) => iso(offset)); return <div className="calendar-view"><div className="calendar-days">{dates.map((date) => <button key={date} className={date === selectedDate ? 'selected' : ''} onClick={() => setSelectedDate(date)}><span>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))}</span><b>{new Date(`${date}T12:00:00`).getDate()}</b></button>)}</div><div className="calendar-schedule">{STAFF_MEMBERS.map((staff) => <div className="schedule-row" key={staff.id}><div className="schedule-staff"><div className="staff-image small"><Image src={staff.image_url || '/images/boss.png'} alt={staff.name} fill className="object-cover" /></div><span>{staff.name.split(' ')[0]}</span></div><div className="schedule-track">{bookings.filter((booking) => booking.stylistId === staff.id && booking.date === selectedDate && booking.status !== 'cancelled').map((booking) => <button key={booking.id} className={`schedule-event event-${staff.id}`} onClick={() => onReschedule(booking.id)} style={{ left: `${(Number(booking.time.slice(0, 2)) * 60 + Number(booking.time.slice(3)) - 540) / 6.6}%`, width: `${booking.duration / 6.6}%` }}><b>{booking.time}</b><span>{booking.customer}</span></button>)}{bookings.filter((booking) => booking.stylistId === staff.id && booking.date === selectedDate && booking.status !== 'cancelled').length === 0 && <span className="no-appointments">No appointments</span>}</div></div>)}</div></div> }

function RescheduleModal({ booking, onClose, onSave }: { booking: Booking; onClose: () => void; onSave: (id: string, date: string, time: string) => void }) { const [date, setDate] = useState(booking.date); const [time, setTime] = useState(booking.time); return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">Manage appointment</p><h2>{booking.customer}</h2><span>{booking.id} · {booking.service}</span></div><button className="close-button" onClick={onClose}><Icon name="close" /></button></div><div className="modal-body"><div className="modal-detail"><span>Current status</span><StatusPill status={booking.status} /></div><div className="form-grid"><label>New date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>New time<select value={time} onChange={(event) => setTime(event.target.value)}>{['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '15:00', '16:00', '16:30'].map((slot) => <option key={slot}>{slot}</option>)}</select></label></div><p className="modal-note"><Icon name="bell" size={15} /> The customer will receive an updated appointment notification.</p></div><div className="modal-actions"><button className="cancel-button" onClick={() => onSave(booking.id, booking.date, booking.time)}>Cancel booking</button><div><button className="secondary-button" onClick={onClose}>Close</button><button className="primary-button" onClick={() => onSave(booking.id, date, time)}>Save changes</button></div></div></div></div> }
