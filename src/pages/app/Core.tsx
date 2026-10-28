import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge, Icon } from '../../components/ui'
import TableArt from '../../components/TableArt'
import { Timeline } from '../Passport'
import { useDB, now, warranty, nextDue, owner, naira, fmtDate, MONTH, DAY, findTable, svcName, fmtSlot, update, ago } from '../../lib/data'

export function Overview() {
  const db = useDB(); const n = now(db)
  const act = db.tables.filter(t => warranty(t, n).active).length
  const due = db.tables.filter(t => t.status === 'active' && nextDue(t, n).due < n + 30 * DAY).length
  const months = useMemo(() => Array.from({ length: 12 }).map((_, i) => { const d = new Date(n); d.setDate(1); d.setHours(0, 0, 0, 0); d.setMonth(d.getMonth() - 11 + i); const s = d.getTime(); const e = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime(); return { k: d.toLocaleDateString('en-GB', { month: 'short' }), v: db.tables.flatMap(t => t.history).filter(x => x.date >= s && x.date < e).reduce((a, x) => a + (x.price || 0), 0) } }), [db, n])
  const year = months.reduce((a, m) => a + m.v, 0), max = Math.max(...months.map(m => m.v), 1)
  const sent = db.reminders.length, opened = db.reminders.filter(r => r.status !== 'sent').length, booked = db.reminders.filter(r => r.status === 'booked').length
  return <>
    <div className="grid g4">
      <div className="card tight kpi"><span className="label">Tables registered</span><div className="v" data-testid="kpi-tables">{db.tables.length}</div><div className="d">{db.orders.filter(o => !o.done).length} awaiting install</div></div>
      <div className="card tight kpi"><span className="label">Active warranties</span><div className="v">{act}</div><div className="d">{db.tables.length - act} out of warranty</div></div>
      <div className="card tight kpi"><span className="label">Service due · 30 days</span><div className="v">{due}</div><div className="d">Reminders go out automatically</div></div>
      <div className="card tight kpi"><span className="label">Service revenue · 12 mo</span><div className="v">{naira(year)}</div><div className="d">From tables already sold</div></div>
    </div>
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)' }}>
      <div className="card"><div className="spread"><div><span className="label">Recurring service income</span><h3 style={{ marginTop: 6 }}>Monthly service revenue</h3></div><span className="mono small muted">{naira(year / 12)} / mo avg</span></div>
        <div className="bars" style={{ height: 190, marginTop: 14 }}>{months.map((m, i) => <div className="b" key={i} title={naira(m.v)}><span className={i === 11 ? 'today' : ''} style={{ height: Math.max(2, m.v / max * 150) }} /><em>{m.k}</em></div>)}</div></div>
      <div className="card"><span className="label">Booking conversion from reminders</span><h3 style={{ marginTop: 6 }}>{sent ? Math.round(booked / sent * 100) : 0}% of reminders become bookings</h3>
        <div className="funnel" style={{ marginTop: 16 }}>{[['Reminders sent', sent], ['Link opened', opened], ['Booked', booked]].map(([k, v]) => <div className="st" key={k as string}><span>{k}</span><span className="mono">{v}</span></div>)}</div>
        <Link to="/app/reminders" className="btn ghost sm" style={{ marginTop: 8 }}>Open reminders</Link></div>
    </div>
    <div className="grid g2">
      <div className="card"><div className="spread"><span className="label">Latest bookings</span><Link className="link small" to="/app/bookings">All</Link></div>
        <table className="table" style={{ marginTop: 8 }}><tbody>{db.bookings.slice(0, 5).map(b => { const t = findTable(db, b.serial); return <tr key={b.ref}><td className="mono xs">{b.ref}</td><td>{t && owner(t).name}<div className="xs muted">{svcName(b.service)}</div></td><td className="xs">{fmtSlot(b.slot)}</td><td><Badge kind={b.status === 'done' ? 'ok' : b.status === 'scheduled' ? 'blue' : 'acc'}>{b.status}</Badge></td></tr> })}</tbody></table></div>
      <div className="card"><div className="spread"><span className="label">Authenticity alerts</span><Link className="link small" to="/app/alerts">All</Link></div>
        <div className="stack" style={{ marginTop: 12 }}>{db.alerts.slice(0, 4).map(a => <div key={a.id} className="spread small"><span><span className="mono">{a.serial}</span><div className="xs muted">{a.city} · {ago(a.at, n)}</div></span><Badge kind={a.result === 'stolen' ? 'acc' : 'warn'}>{a.result === 'stolen' ? 'Stolen' : 'Unknown serial'}</Badge></div>)}</div></div>
    </div>
  </>
}

export function Tables() {
  const db = useDB(); const n = now(db); const { serial } = useParams(); const nav = useNavigate()
  const [q, setQ] = useState(''); const [f, setF] = useState('all')
  const list = db.tables.filter(t => (q ? (t.serial + owner(t).name + t.model + owner(t).city).toLowerCase().includes(q.toLowerCase()) : true) && (f === 'all' || (f === 'marble' && t.bed === 'marble') || (f === 'wood' && t.bed === 'wood') || (f === 'due' && nextDue(t, n).due < n + 30 * DAY) || (f === 'warranty' && warranty(t, n).active) || (f === 'flag' && t.status !== 'active')))
  const t = serial ? findTable(db, serial) : undefined
  return <div className="grid" style={{ gridTemplateColumns: t ? 'minmax(0,1fr) 420px' : '1fr', alignItems: 'start' }}>
    <div className="card flush">
      <div className="row wrap" style={{ padding: 16, gap: 8 }}><input className="input" style={{ maxWidth: 280 }} placeholder="Search serial, owner, city" value={q} onChange={e => setQ(e.target.value)} data-testid="tsearch" />
        {[['all', 'All'], ['marble', 'Marble bed'], ['wood', 'Wood bed'], ['due', 'Service due'], ['warranty', 'In warranty'], ['flag', 'Flagged']].map(([k, v]) => <button key={k} className={`chip ${f === k ? 'on' : ''}`} onClick={() => setF(k)}>{v}</button>)}<span className="mono xs muted" style={{ marginLeft: 'auto' }}>{list.length} tables</span></div>
      <table className="table"><thead><tr><th>Serial</th><th>Owner</th><th>Table</th><th>Warranty</th><th>Next care</th></tr></thead>
        <tbody>{list.map(x => { const w = warranty(x, n), d = nextDue(x, n); return <tr key={x.serial} className="click" onClick={() => nav('/app/tables/' + x.serial)} style={x.serial === serial ? { background: 'var(--bg)' } : undefined}>
          <td><span className="mono xs">{x.serial}</span>{x.status === 'stolen' && <> <Badge kind="acc">Stolen</Badge></>}</td><td>{owner(x).name}<div className="xs muted">{owner(x).city}</div></td>
          <td><span className="row" style={{ gap: 6 }}><i className="sw" style={{ background: x.woodHex }} /><i className="sw" style={{ background: x.clothHex }} />{x.model}</span><div className="xs muted">{x.bed} bed · {x.size}</div></td>
          <td>{w.active ? <Badge kind="ok">{Math.round(w.left / 30.4)} mo left</Badge> : <Badge>Ended</Badge>}</td>
          <td className="xs">{d.overdue ? <Badge kind="acc">Overdue</Badge> : fmtDate(d.due)}</td></tr> })}</tbody></table>
    </div>
    {t && <div className="card fade-in" style={{ position: 'sticky', top: 16 }} data-testid="tdetail">
      <div className="spread"><span className="label">{t.serial}</span><button className="icon-btn" onClick={() => nav('/app/tables')}><Icon n="x" /></button></div>
      <h2 style={{ marginTop: 6 }}>{t.model} · {t.size}</h2><p className="small mut">{owner(t).name} · {owner(t).phone} · {owner(t).city}</p>
      <div style={{ margin: '12px 0' }}><TableArt wood={t.woodHex} cloth={t.clothHex} game={t.game} bed={t.bed} /></div>
      <div className="row wrap" style={{ gap: 6 }}><Link className="btn cta sm" to={'/p/' + t.serial}>Open passport</Link><Link className="btn ghost sm" to={'/print/plate/' + t.serial}>Plate</Link>
        <button className="btn ghost sm" onClick={() => update(d => { const x = findTable(d, t.serial)!; x.status = x.status === 'stolen' ? 'active' : 'stolen' })}>{t.status === 'stolen' ? 'Clear stolen flag' : 'Mark stolen'}</button></div>
      <div className="hr" /><span className="label">Service history</span><div style={{ marginTop: 12, maxHeight: 360, overflow: 'auto' }}><Timeline t={t} /></div>
    </div>}
  </div>
}
