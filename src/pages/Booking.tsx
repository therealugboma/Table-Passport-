import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CoLock, Icon, WaIcon, ctaMove } from '../components/ui'
import TableArt from '../components/TableArt'
import { useDB, findTable, owner, first, now, SERVICES, CLOTHS, naira, fmtSlot, dayAt, DAY, addBooking, update, waLink, nextDue, fmtDate } from '../lib/data'

export default function Booking() {
  const { token = '' } = useParams(); const db = useDB()
  const rem = db.reminders.find(r => r.token === token)
  const serial = rem?.serial || (token.startsWith('p-') ? token.slice(2) : '')
  const t = findTable(db, serial)
  const [svc, setSvc] = useState(rem?.rule.includes('re-cloth') ? 'recloth' : rem?.rule.includes('12') ? 'full' : 'levelling')
  const [cloth, setCloth] = useState<string>(CLOTHS[0][0]); const [slot, setSlot] = useState(0); const [ref, setRef] = useState('')
  useEffect(() => { if (rem && rem.status === 'sent') update(d => { const r = d.reminders.find(x => x.token === token); if (r) r.status = 'opened' }) }, [token])
  const n = now(db)
  const slots = useMemo(() => { const out: { t: number; taken: boolean }[] = []; let d = n + DAY; while (out.length < 15) { const wd = new Date(d).getDay(); if (wd !== 0) [9, 12, 15].forEach((h, i) => out.push({ t: dayAt(d, h), taken: (new Date(d).getDate() + i) % 4 === 0 })); d += DAY } return out }, [Math.floor(n / DAY)])
  if (!t) return <div className="pp"><div className="pcard"><span className="label acc">Link not recognised</span><h2 style={{ marginTop: 8 }}>This booking link has expired.</h2><p className="mut" style={{ marginTop: 8 }}>Open your table passport by scanning the plate under the rail, or message EMRAD.</p></div></div>
  const o = owner(t), price = db.prices[svc] || 0, sv = SERVICES.find(s => s.id === svc)!
  const existing = db.bookings.find(b => b.ref === ref)
  if (ref && existing) return <div className="pp">
    <div className="ptop"><CoLock /><span className="label">Booking confirmed</span></div>
    <section className="pcard cert" style={{ textAlign: 'center' }} data-testid="confirmed">
      <div className="okring"><Icon n="check" s={30} sw={2} /></div>
      <span className="label acc" style={{ display: 'block', marginTop: 16 }}>Reference · {ref}</span>
      <h2 style={{ marginTop: 8 }}>You're booked, {first(o.name)}.</h2>
      <p className="mut" style={{ marginTop: 8 }}>{svcName(svc)}{existing.cloth ? ` in ${existing.cloth}` : ''} on <b style={{ color: 'var(--ink)', fontWeight: 450 }}>{fmtSlot(existing.slot)}</b> at your registered address in {o.city}.</p>
      <div className="facts" style={{ marginTop: 18 }}><div><b>{naira(existing.price)}</b><span className="label">Estimate</span></div><div><b>{sv.dur}</b><span className="label">Duration</span></div><div><b>{t.model}</b><span className="label">Table</span></div></div>
      <p className="xs muted" style={{ marginTop: 16 }}>EMRAD will confirm the technician on WhatsApp. Pay after the job.</p>
      <div className="stack" style={{ marginTop: 18 }}><Link className="btn cta" to={'/p/' + t.serial}>Back to my passport</Link><a className="btn soft" href={waLink(db.brand.phone, `Booking ${ref} for ${t.serial}`)} target="_blank" rel="noreferrer"><WaIcon s={15} />Message EMRAD</a></div>
    </section></div>
  return <div className="pp">
    <div className="ptop"><CoLock /><span className="label">{rem ? 'From your reminder' : 'Book a service'}</span></div>
    <section className="pcard bhead">
      <div className="bta"><TableArt wood={t.woodHex} cloth={t.clothHex} game={t.game} /></div>
      <div><span className="label">Hi {first(o.name)} · already filled in</span><h2 style={{ marginTop: 6, fontSize: 22 }}>{t.model} · {t.size}</h2><p className="mono xs muted" style={{ marginTop: 4 }}>{t.serial}</p><p className="small mut" style={{ marginTop: 6 }}>{o.name} · {o.phone} · {o.city}</p></div>
    </section>
    {rem && <div className="remnote"><Icon n="bell" s={14} />{rem.rule} · last care {fmtDate(nextDue(t, n).due - 6 * 30.44 * DAY)}</div>}
    <section className="pcard">
      <span className="label">1 · Service</span>
      <div className="svcs">{SERVICES.map(s => <button key={s.id} className={`svc ${svc === s.id ? 'on' : ''}`} onClick={() => setSvc(s.id)} data-testid={'svc-' + s.id}>
        <div className="spread"><b>{s.t}</b><span className="mono small">{naira(db.prices[s.id])}</span></div><p className="xs">{s.d} · {s.dur}</p></button>)}</div>
      {svc === 'recloth' && <><span className="label" style={{ display: 'block', margin: '16px 0 10px' }}>Cloth colour</span>
        <div className="cloths">{CLOTHS.map(([nm, hex]) => <button key={nm} className={cloth === nm ? 'on' : ''} onClick={() => setCloth(nm)} title={nm}><i style={{ background: hex }} /><span>{nm}</span></button>)}</div></>}
    </section>
    <section className="pcard">
      <span className="label">2 · Time</span>
      <div className="slots">{slots.map((s, i) => <button key={s.t} disabled={s.taken} className={slot === s.t ? 'on' : ''} onClick={() => setSlot(s.t)} data-testid="slot">
        <span className="mono xs">{new Date(s.t).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span><b>{new Date(s.t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</b></button>)}</div>
    </section>
    <div className="bfoot">
      <div><span className="label">{sv.t}</span><b className="num">{naira(price)}</b></div>
      <button className="btn cta big" disabled={!slot} onMouseMove={ctaMove} data-testid="confirm" onClick={() => setRef(addBooking({ serial: t.serial, service: svc, cloth: svc === 'recloth' ? cloth : undefined, slot, price, source: rem ? 'reminder' : 'passport', token: rem?.token }))}>{slot ? 'Confirm booking' : 'Pick a time'}</button>
    </div>
  </div>
}
const svcName = (id: string) => SERVICES.find(s => s.id === id)?.t || id
