import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Icon } from '../../components/ui'
import Qr from '../../components/Qr'
import { stickerUrl } from '../Print'
import { useDB, now, update, findTable, owner, fmtDate, naira, ago, SERVICES, baseUrl } from '../../lib/data'

export function Stickers() {
  const db = useDB(); const [count, setCount] = useState(24)
  const batches = [...new Set(db.stickers.map(s => s.batch))].reverse()
  return <>
    <div className="card simbar"><div><span className="label">QR stickers & plates</span><h3 style={{ marginTop: 6 }}>Each sticker is unique and gets linked to a serial at installation.</h3><p className="small mut" style={{ marginTop: 4 }}>{db.stickers.filter(s => !s.serial).length} unassigned in stock.</p></div>
      <div className="row wrap"><select className="select" style={{ width: 120 }} value={count} onChange={e => setCount(+e.target.value)}>{[24, 48, 96].map(n => <option key={n} value={n}>{n} labels</option>)}</select>
        <button className="btn cta" onClick={() => update(d => { const b = 'B-' + new Date(now(d)).getFullYear() + '-' + String(d.stickers.length).padStart(3, '0'); const start = 1000 + d.stickers.length + 300; for (let i = 0; i < count; i++) d.stickers.push({ id: 'TP-' + String(start + i).padStart(6, '0'), batch: b }) })} data-testid="genbatch">Generate batch</button></div></div>
    <div className="grid g3">{batches.map(b => { const s = db.stickers.filter(x => x.batch === b); return <div className="card tight" key={b}><div className="spread"><span className="label">Batch {b}</span><Badge kind={s.every(x => x.serial) ? 'ok' : 'warn'}>{s.filter(x => x.serial).length}/{s.length} used</Badge></div>
      <div className="row" style={{ marginTop: 14, gap: 8 }}>{s.slice(0, 3).map(x => <Qr key={x.id} text={stickerUrl(x.id)} size={54} />)}</div>
      <p className="mono xs muted" style={{ marginTop: 10 }}>{s[0].id} – {s[s.length - 1].id}</p>
      <Link className="btn ghost sm" style={{ marginTop: 12 }} to={'/print/stickers?batch=' + b}><Icon n="print" s={14} />Printable sheet</Link></div> })}
      <div className="card tight"><span className="label">Plate design</span><p className="small mut" style={{ marginTop: 8 }}>Engraved aluminium plate for under the rail, with the sticker as a backup inside the frame.</p><Link className="btn ghost sm" style={{ marginTop: 12 }} to="/print/plate/EMR-SN-24-0117">View plate mock</Link></div>
    </div>
  </>
}

export function Transfers() {
  const db = useDB(); const n = now(db); const listed = db.tables.filter(t => t.resale)
  return <div className="grid g2" style={{ alignItems: 'start' }}>
    <div className="card flush"><div style={{ padding: '20px 20px 4px' }}><span className="label">Ownership transfers</span></div>
      <table className="table"><thead><tr><th>Table</th><th>From → To</th><th>Date</th><th></th></tr></thead><tbody>{db.transfers.map(x => <tr key={x.id}><td className="mono xs">{x.serial}</td><td className="small">{x.from} → <b style={{ fontWeight: 450 }}>{x.to}</b><div className="xs muted">{x.phone}</div></td><td className="xs">{fmtDate(x.at)}</td>
        <td className="r">{x.status === 'pending' ? <button className="btn cta sm" onClick={() => update(d => { const tr = d.transfers.find(y => y.id === x.id)!; tr.status = 'approved'; const t = findTable(d, x.serial)!; const o = t.owners[t.owners.length - 1]; o.to = now(d); t.owners.push({ name: x.to, phone: x.phone, city: o.city, from: now(d) }); t.history.push({ id: 'tr' + x.id, date: now(d), type: 'transfer', title: 'Ownership transferred', note: 'Verified by EMRAD. History and warranty carried over.' }); t.resale = null })}>Approve</button> : <Badge kind="ok">Approved</Badge>}</td></tr>)}</tbody></table>
      {!db.transfers.some(x => x.status === 'pending') && <p className="xs muted" style={{ padding: 16 }}>Start one from an owner passport → "Transfer ownership".</p>}</div>
    <div className="card flush"><div style={{ padding: '20px 20px 4px' }}><span className="label">Resale listings</span></div>
      <table className="table"><thead><tr><th>Table</th><th>Price</th><th>Listed</th><th></th></tr></thead><tbody>{listed.map(t => <tr key={t.serial}><td>{t.model}<div className="xs muted mono">{t.serial}</div></td><td className="num">{naira(t.resale!.price)}</td><td className="xs">{ago(t.resale!.listedAt, n)}</td><td className="r"><Link className="btn soft sm" to={'/r/' + t.serial}>Public view</Link></td></tr>)}</tbody></table>
      <p className="xs muted" style={{ padding: 16 }}>Public views show specs and verified history. Owner details stay private.</p></div>
  </div>
}

export function Alerts() {
  const db = useDB(); const n = now(db)
  return <><div className="grid g3">
    <div className="card tight kpi"><span className="label">Unknown serial scans</span><div className="v">{db.alerts.filter(a => a.result === 'unknown').length}</div><div className="d">Possible counterfeits</div></div>
    <div className="card tight kpi"><span className="label">Stolen-table checks</span><div className="v">{db.alerts.filter(a => a.result === 'stolen').length}</div><div className="d">Owner notified</div></div>
    <div className="card tight kpi"><span className="label">Flagged tables</span><div className="v">{db.tables.filter(t => t.status === 'stolen').length}</div><div className="d">Marked stolen in registry</div></div></div>
    <div className="card flush"><table className="table" data-testid="alerts"><thead><tr><th>Serial checked</th><th>Result</th><th>Where</th><th>When</th><th>Note</th></tr></thead><tbody>{db.alerts.map(a => <tr key={a.id}><td className="mono xs">{a.serial}</td><td><Badge kind={a.result === 'stolen' ? 'acc' : 'warn'}>{a.result === 'stolen' ? 'Reported stolen' : 'Not in registry'}</Badge></td><td className="small">{a.city}</td><td className="xs">{ago(a.at, n)}</td><td className="small muted">{a.note}</td></tr>)}</tbody></table></div></>
}

export function Settings() {
  const db = useDB()
  return <div className="grid g2" style={{ alignItems: 'start' }}>
    <div className="card"><span className="label">Reminder templates</span><p className="xs muted" style={{ marginTop: 4 }}>Placeholders: {'{first} {model} {link} {date}'}</p>
      <div className="stack" style={{ marginTop: 14 }}>{db.rules.map(r => <label className="field" key={r.id}><span>{r.name}</span><textarea className="textarea" value={r.template} onChange={e => update(d => { d.rules.find(x => x.id === r.id)!.template = e.target.value })} /></label>)}</div></div>
    <div className="stack" style={{ gap: 16 }}>
      <div className="card"><span className="label">Service price list · example</span><div className="stack" style={{ marginTop: 14 }}>{SERVICES.map(s => <div key={s.id} className="spread"><span className="small">{s.t}<div className="xs muted">{s.dur}</div></span><div className="row" style={{ gap: 6 }}><span className="mono small muted">₦</span><input className="input mono" style={{ width: 130, textAlign: 'right' }} value={db.prices[s.id]} onChange={e => update(d => { d.prices[s.id] = Number(e.target.value.replace(/\D/g, '')) || 0 })} /></div></div>)}</div></div>
      <div className="card"><span className="label">Branding</span><div className="stack" style={{ marginTop: 14 }}>
        <label className="field"><span>Business name</span><input className="input" value={db.brand.name} onChange={e => update(d => { d.brand.name = e.target.value })} /></label>
        <label className="field"><span>WhatsApp business number</span><input className="input mono" value={db.brand.phone} onChange={e => update(d => { d.brand.phone = e.target.value })} /></label>
        <label className="field"><span>Passport domain</span><input className="input mono" readOnly value="passport.emrad.ng" /></label>
        <p className="xs muted">This demo runs at {baseUrl()}.</p></div></div>
    </div>
  </div>
}
