import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { Icon, Mark } from '../../components/ui'
import { useDB, now, fmtDate, reset, svcName, findTable, owner, fmtSlot } from '../../lib/data'

const NAV: [string, string, string][] = [['/app', 'Overview', 'home'], ['/app/tables', 'Tables registry', 'table'], ['/app/reminders', 'Reminders', 'bell'], ['/app/bookings', 'Bookings', 'cal'], ['/app/technicians', 'Technicians', 'users'], ['/app/stickers', 'QR stickers', 'qr'], ['/app/transfers', 'Transfers & resale', 'swap'], ['/app/alerts', 'Authenticity alerts', 'shield'], ['/app/settings', 'Settings', 'gear']]
const TITLES: Record<string, string> = Object.fromEntries(NAV.map(n => [n[0], n[1]]))
export default function Layout() {
  const db = useDB(); const loc = useLocation(); const [open, setOpen] = useState(false)
  const [toasts, setToasts] = useState<{ ref: string; t: string; d: string }[]>([])
  const seen = useRef<Set<string> | null>(null)
  useEffect(() => {
    const refs = new Set(db.bookings.map(b => b.ref))
    if (seen.current) { const nw = db.bookings.filter(b => !seen.current!.has(b.ref)); if (nw.length) setToasts(ts => [...nw.map(b => { const t = findTable(db, b.serial); return { ref: b.ref, t: 'New booking · ' + b.ref, d: `${t ? owner(t).name : ''} · ${svcName(b.service)} · ${fmtSlot(b.slot)}${b.source === 'reminder' ? ' · from reminder' : ''}` } }), ...ts].slice(0, 3)) }
    seen.current = refs
  }, [db.bookings])
  useEffect(() => { if (!toasts.length) return; const h = setTimeout(() => setToasts(t => t.slice(0, -1)), 7000); return () => clearTimeout(h) }, [toasts])
  useEffect(() => setOpen(false), [loc.pathname])
  const cnt: Record<string, number> = { '/app/bookings': db.bookings.filter(b => b.status === 'requested').length, '/app/alerts': db.alerts.filter(a => a.result !== 'genuine').length, '/app/transfers': db.transfers.filter(t => t.status === 'pending').length }
  const base = '/' + loc.pathname.split('/').slice(1, 3).join('/')
  return <div className="app">
    {open && <div className="scrim" onClick={() => setOpen(false)} />}
    <aside className={`side ${open ? 'open' : ''}`}>
      <div className="wsw"><button><span className="wslogo">EM</span><span><b style={{ fontWeight: 450, fontSize: 14 }}>Emerald Billiards</b><br /><span className="xs muted">Table Passport · EMRAD × VUG</span></span></button></div>
      <span className="label grp">Service desk</span>
      {NAV.map(([to, t, ic]) => <NavLink key={to} to={to} end={to === '/app'} className="navl"><Icon n={ic} />{t}{cnt[to] ? <span className="cnt">{cnt[to]}</span> : null}</NavLink>)}
      <span className="label grp">Open as</span>
      <Link className="navl" to="/install"><Icon n="phone" />Installer app</Link>
      <Link className="navl" to="/p/EMR-SN-24-0117"><Icon n="book" />Owner passport</Link>
      <Link className="navl" to="/verify"><Icon n="shield" />Verify page</Link>
      <div style={{ marginTop: 'auto', padding: '14px 12px 2px' }}>
        <div className="row" style={{ gap: 8 }}><Mark s={16} /><span className="small">Table Passport <span className="muted">by VUG</span></span></div>
        <button className="btn soft sm" style={{ marginTop: 10, width: '100%' }} onClick={() => { if (confirm('Reset all demo data?')) { reset(); location.hash = '#/app' } }} data-testid="reset"><Icon n="refresh" s={13} />Reset demo data</button>
      </div>
    </aside>
    <main className="main">
      <div className="topbar">
        <div className="row"><button className="icon-btn mobnav" onClick={() => setOpen(true)} aria-label="Menu"><Icon n="menu" /></button><h1>{TITLES[base] || 'Overview'}</h1></div>
        <div className="row"><span className="pill"><span className="label">Demo date</span><span className="mono small" data-testid="demodate">{fmtDate(now(db))}</span>{db.offset > 0 && <span className="badge warn">+{Math.round(db.offset / 2.63e9)} mo</span>}</span></div>
      </div>
      <Outlet />
    </main>
    <div className="toasts">{toasts.map(t => <Link key={t.ref} to="/app/bookings" className="toast"><Icon n="cal" s={18} /><div><span className="label">{t.t}</span><p>{t.d}</p></div></Link>)}</div>
  </div>
}
