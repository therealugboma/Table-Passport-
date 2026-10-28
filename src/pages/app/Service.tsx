import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Icon, WaIcon, ctaMove } from '../../components/ui'
import { useDB, now, simulate, owner, findTable, fmtDate, fmtSlot, naira, svcName, update, completeBooking, MONTH, DAY, bookUrl, fillTpl, ago, getPref, setPref, usePref, get, type Reminder, type DB } from '../../lib/data'

export function WaPreview({ r, db }: { r: Reminder; db: DB }) {
  const t = findTable(db, r.serial); if (!t) return null
  const msg = r.msg || fillTpl(db.rules.find(x => x.name === r.rule)?.template || db.rules[0].template, t, bookUrl(r.token))
  const url = bookUrl(r.token); const [pre, post] = msg.split(url)
  return <div className="wa" data-testid="wa-preview"><div className="wa-h"><div className="av ink">EM</div><div><b>Emerald Billiards</b><small>to {owner(t).name} · {owner(t).phone}</small></div></div>
    <div className="wa-b"><div className="wa-m">{pre}{post !== undefined && <Link to={'/b/' + r.token} className="walink" data-testid="wa-link">{url}</Link>}{post}<span>{new Date(r.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ✓✓</span></div></div></div>
}

export function Reminders() {
  const db = useDB(); const n = now(db); const fid = usePref('featuredRem', '')
  const [last, setLast] = useState<number | null>(null)
  const featured = db.reminders.find(r => r.id === fid) || db.reminders[0]
  const queue = useMemo(() => db.tables.filter(t => t.status === 'active').flatMap(t => db.rules.filter(r => r.on).map(r => ({ t, r, at: r.kind === 'warranty' ? t.installDate + (t.warrantyMonths - 1) * MONTH : t.installDate + r.months * MONTH }))).filter(x => x.at > n && x.at < n + 200 * DAY).sort((a, b) => a.at - b.at).slice(0, 8), [db, n])
  const run = (days: number) => { const out = simulate(days); setLast(out.length); const newest = get().orders.find(o => o.done)?.serial; const pick = out.find(r => r.serial === newest) || out.find(r => r.serial === 'EMR-SN-24-0117') || out[0]; if (pick) setPref('featuredRem', pick.id) }
  return <>
    <div className="card simbar"><div><span className="label">Time machine · demo only</span><h3 style={{ marginTop: 6 }}>Move the clock forward and let the rules fire.</h3><p className="small mut" style={{ marginTop: 4 }}>Today in the demo is {fmtDate(n)}. Every table that crosses a milestone gets its WhatsApp reminder.</p></div>
      <div className="row wrap"><button className="btn ghost sm" onClick={() => run(31)}>+1 month</button><button className="btn cta" onClick={() => run(184)} onMouseMove={ctaMove} data-testid="sim6">Simulate time: +6 months</button>{db.offset > 0 && <button className="btn soft sm" onClick={() => update(d => { d.offset = 0 })}>Back to today</button>}</div></div>
    {last !== null && <div className="banner fade-in" data-testid="sim-result"><Icon n="check" s={16} />{last} reminder{last === 1 ? '' : 's'} sent on WhatsApp (simulated). {featured && <>Showing the one for {owner(findTable(db, featured.serial)!).name}.</>}</div>}
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) 400px', alignItems: 'start' }}>
      <div className="stack" style={{ gap: 16 }}>
        <div className="card"><span className="label">Rules</span><div className="stack" style={{ marginTop: 12 }}>{db.rules.map(r => <div key={r.id} className="rule"><button className={`tog ${r.on ? 'on' : ''}`} onClick={() => update(d => { const x = d.rules.find(y => y.id === r.id)!; x.on = !x.on })} aria-label="toggle" /><div><b>{r.name}</b><p className="xs muted">{r.kind === 'warranty' ? '30 days before the warranty ends' : `${r.months} months after installation`} · WhatsApp + booking link</p></div></div>)}</div></div>
        <div className="card flush"><div style={{ padding: '20px 20px 4px' }}><span className="label">Sent · {db.reminders.length}</span></div>
          <table className="table"><thead><tr><th>Owner</th><th>Rule</th><th>Sent</th><th>Status</th><th></th></tr></thead><tbody>{db.reminders.slice(0, 14).map(r => { const t = findTable(db, r.serial); return <tr key={r.id} style={r.id === featured?.id ? { background: 'var(--bg)' } : undefined}><td>{t && owner(t).name}<div className="xs muted mono">{r.serial}</div></td><td className="small">{r.rule}</td><td className="xs">{ago(r.sentAt, n)}</td><td><Badge kind={r.status === 'booked' ? 'ok' : r.status === 'opened' ? 'blue' : ''}>{r.status}</Badge></td><td className="r"><button className="btn soft sm" onClick={() => setPref('featuredRem', r.id)}>Preview</button></td></tr> })}</tbody></table></div>
        <div className="card"><span className="label">Upcoming queue · next 200 days</span><div className="stack" style={{ marginTop: 12 }}>{queue.map(x => <div key={x.t.serial + x.r.id} className="spread small"><span>{owner(x.t).name} <span className="muted">· {x.t.model}</span></span><span className="row" style={{ gap: 10 }}><span className="xs muted">{x.r.name}</span><span className="mono xs">{fmtDate(x.at)}</span></span></div>)}</div></div>
      </div>
      <div className="card" style={{ position: 'sticky', top: 16 }}><span className="label">WhatsApp preview</span>{featured ? <><p className="xs muted" style={{ margin: '6px 0 12px' }}>{featured.rule} · unique link, opens a pre-filled booking page</p><WaPreview r={featured} db={db} /><Link to={'/b/' + featured.token} className="btn cta" style={{ width: '100%', marginTop: 14 }} data-testid="open-link">Open link as owner ↗</Link></> : <p className="mut small">Run the simulation to send reminders.</p>}</div>
    </div>
  </>
}

export function Bookings() {
  const db = useDB(); const n = now(db); const [view, setView] = useState<'list' | 'cal'>('list')
  const days = Array.from({ length: 14 }).map((_, i) => { const d = new Date(n + i * DAY); d.setHours(0, 0, 0, 0); return d.getTime() })
  return <>
    <div className="spread"><div className="tabs"><button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>List</button><button className={view === 'cal' ? 'on' : ''} onClick={() => setView('cal')}>Calendar</button></div><span className="mono xs muted">{db.bookings.filter(b => b.status !== 'done').length} open · {db.bookings.filter(b => b.status === 'done').length} done</span></div>
    {view === 'list' ? <div className="card flush"><table className="table"><thead><tr><th>Ref</th><th>Owner & table</th><th>Service</th><th>Slot</th><th>Source</th><th>Technician</th><th>Status</th><th></th></tr></thead><tbody>
      {db.bookings.map(b => { const t = findTable(db, b.serial)!; return <tr key={b.ref} className={b.fresh ? 'freshrow' : ''} data-testid={'bk-' + b.ref}>
        <td className="mono xs">{b.ref}</td><td>{owner(t).name}<div className="xs muted"><Link className="link" to={'/app/tables/' + t.serial}>{t.serial}</Link> · {owner(t).city}</div></td>
        <td>{svcName(b.service)}{b.cloth && <div className="xs muted">{b.cloth}</div>}<div className="xs muted">{naira(b.price)}</div></td><td className="xs">{fmtSlot(b.slot)}</td>
        <td>{b.source === 'reminder' ? <Badge kind="blue">Reminder</Badge> : <Badge>{b.source}</Badge>}</td>
        <td><select className="select" style={{ minHeight: 34, padding: '4px 8px', width: 140 }} value={b.tech || ''} disabled={b.status === 'done'} onChange={e => update(d => { const x = d.bookings.find(y => y.ref === b.ref)!; x.tech = e.target.value; x.status = e.target.value ? 'scheduled' : 'requested' })} data-testid={'assign-' + b.ref}><option value="">Assign…</option>{db.techs.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></td>
        <td><Badge kind={b.status === 'done' ? 'ok' : b.status === 'scheduled' ? 'blue' : 'acc'}>{b.status}</Badge></td>
        <td className="r">{b.status !== 'done' ? <button className="btn cta sm" disabled={!b.tech} onClick={() => completeBooking(b.ref)} data-testid={'done-' + b.ref}>Mark done</button> : <Link className="btn soft sm" to={'/p/' + b.serial}>Passport</Link>}</td></tr> })}
    </tbody></table></div> :
      <div className="cal">{days.map(d => <div key={d} className="cald"><span className="label">{new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>{db.bookings.filter(b => b.slot >= d && b.slot < d + DAY).map(b => { const t = findTable(db, b.serial)!; return <div key={b.ref} className={`cale ${b.status}`}><b>{new Date(b.slot).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {svcName(b.service)}</b><span>{owner(t).name}</span><span>{db.techs.find(x => x.id === b.tech)?.name || 'Unassigned'}</span></div> })}</div>)}</div>}
  </>
}

export function Techs() {
  const db = useDB()
  return <div className="grid g4">{db.techs.map(t => { const bs = db.bookings.filter(b => b.tech === t.id); const hist = db.tables.flatMap(x => x.history).filter(e => e.by === t.name && e.price !== undefined); return <div key={t.id} className="card tight">
    <div className="row"><div className="av lg ink">{t.name.split(' ').map(s => s[0]).join('')}</div><div><b style={{ fontWeight: 450 }}>{t.name}</b><p className="xs muted">{t.area}</p></div></div>
    <div className="row wrap" style={{ marginTop: 12, gap: 4 }}>{t.skills.map(s => <Badge key={s}>{s}</Badge>)}</div>
    <div className="facts" style={{ marginTop: 14 }}><div><b>{bs.filter(b => b.status !== 'done').length}</b><span className="label">Open</span></div><div><b>{hist.length}</b><span className="label">Jobs done</span></div><div><b>₦{(hist.reduce((a, e) => a + (e.price || 0), 0) / 1e6).toFixed(1)}m</b><span className="label">Billed</span></div></div>
    <a className="btn ghost sm" style={{ marginTop: 14, width: '100%' }} href={'https://wa.me/' + t.phone.replace(/\D/g, '')} target="_blank" rel="noreferrer"><WaIcon s={14} />{t.phone}</a>
  </div> })}</div>
}
