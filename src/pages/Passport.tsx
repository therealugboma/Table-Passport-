import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CoLock, Icon, Modal, WaIcon, Badge, ctaMove } from '../components/ui'
import TableArt from '../components/TableArt'
import Photos from '../components/Photos'
import Qr from '../components/Qr'
import { useDB, findTable, owner, warranty, nextDue, now, fmtDate, naira, waLink, update, baseUrl, type Table } from '../lib/data'

export const evIcon: Record<string, string> = { build: 'wrench', delivery: 'arrow', install: 'check', levelling: 'wrench', recloth: 'table', cushions: 'wrench', relocation: 'swap', full: 'wrench', transfer: 'swap', issue: 'alert', inspection: 'check' }
export function Timeline({ t, hidePrice }: { t: Table; hidePrice?: boolean }) {
  const ev = [...t.history].sort((a, b) => b.date - a.date)
  return <div className="ptl">{ev.map((e, i) => <div className={`pti ${i === 0 ? 'top' : ''}`} key={e.id}>
    <i><Icon n={evIcon[e.type] || 'check'} s={12} /></i>
    <div><div className="spread"><b>{e.title}</b><span className="mono xs muted">{fmtDate(e.date)}</span></div>
      {e.note && <p className="small mut">{e.note}</p>}
      <p className="xs muted">{e.by}{!hidePrice && e.price ? ' · ' + naira(e.price) : ''}</p>
      {e.photo && <img src={e.photo} alt="" className="evph" />}</div>
  </div>)}</div>
}

export default function Passport({ resale }: { resale?: boolean }) {
  const { serial = '' } = useParams(); const db = useDB(); const t = findTable(db, serial)
  const [modal, setModal] = useState<'' | 'issue' | 'transfer' | 'resale'>('')
  if (!t) return <div className="pp"><div className="pcard" style={{ textAlign: 'center' }}><span className="vbadge bad"><Icon n="alert" s={13} />Not in the EMRAD registry</span><h2 style={{ marginTop: 16 }}>We can't find {serial}.</h2><p className="mut" style={{ marginTop: 8 }}>This serial was not issued by Emerald Billiards. If you were offered this table, check it before you pay.</p><Link className="btn cta" style={{ marginTop: 20 }} to={'/verify/' + serial}>Run an authenticity check</Link></div></div>
  const n = now(db), o = owner(t), w = warranty(t, n), nd = nextDue(t, n), stolen = t.status === 'stolen'
  const services = t.history.filter(e => !['build', 'delivery', 'install', 'transfer'].includes(e.type)).length
  const wa = waLink(db.brand.phone, `Hello EMRAD, I'm writing about my table ${t.serial} (${t.model}).`)
  return <div className="pp">
    <div className="ptop"><CoLock /><span className="label">Table passport</span></div>
    <section className="pcard cert">
      <div className="spread"><span className={`vbadge ${stolen ? 'bad' : ''}`} data-testid="auth"><Icon n="shield" s={13} />{stolen ? 'Reported stolen' : 'Genuine EMRAD · Verified'}</span><span className="mono xs muted">{t.sticker}</span></div>
      <div className="pmodel"><span className="label">Emerald Billiards · {t.game}</span><h1>{t.model}</h1><div className="serial">{t.serial}</div></div>
      <div className="part"><TableArt wood={t.woodHex} cloth={t.clothHex} game={t.game} bed={t.bed} /></div>
      <div className="swatches">
        <div><i style={{ background: t.woodHex }} /><span className="label">Wood</span>{t.wood}</div>
        <div><i style={{ background: t.clothHex }} /><span className="label">Cloth</span>{t.cloth}</div>
        <div><i className={t.bed === 'marble' ? 'marble' : 'woodbed'} /><span className="label">Bed</span>{t.bed === 'marble' ? 'Marble' : 'Wood'}</div>
      </div>
      <div className="certline"><span>Hand-built in Lagos</span><span>{fmtDate(t.buildDate)}</span></div>
    </section>
    {resale && <section className="pcard"><span className="label acc">Public resale view</span>
      {t.resale ? <><h2 style={{ marginTop: 8 }}>{naira(t.resale.price)}</h2><p className="mut small" style={{ marginTop: 6 }}>"{t.resale.note}" · listed {fmtDate(t.resale.listedAt)}</p></> : <h3 style={{ marginTop: 8 }}>Verified history, shared by the owner</h3>}
      <div className="facts" style={{ marginTop: 14 }}><div><b>{t.owners.length}</b><span className="label">Owner{t.owners.length > 1 ? 's' : ''}</span></div><div><b>{services}</b><span className="label">Services</span></div><div><b>{Math.max(0, Math.round((n - t.installDate) / 2.63e9))} mo</b><span className="label">Age</span></div></div>
      <p className="xs muted" style={{ marginTop: 12 }}>Owner names, phone numbers and addresses are hidden. Buying it? Ask the seller to start an ownership transfer so the passport and warranty move to you.</p>
      <a className="btn cta" style={{ width: '100%', marginTop: 14 }} href={waLink(db.brand.phone, `Hello EMRAD, I'm interested in the listed table ${t.serial}. Can you confirm it?`)} target="_blank" rel="noreferrer"><WaIcon s={15} />Ask EMRAD to confirm</a>
    </section>}
    {!resale && <section className="pcard">
      <div className="spread"><span className="label">Next care</span>{nd.overdue ? <Badge kind="acc">Due now</Badge> : <Badge kind="ok">On track</Badge>}</div>
      <h3 style={{ marginTop: 10, fontSize: 20, fontWeight: 400 }}>{nd.what}</h3>
      <p className="mut small" style={{ marginTop: 4 }}>{nd.overdue ? `Due since ${fmtDate(nd.due)}` : `Recommended by ${fmtDate(nd.due)} · in ${nd.days} days`}</p>
      <Link to={'/b/p-' + t.serial} className="btn cta big" style={{ marginTop: 16 }} onMouseMove={ctaMove} data-testid="book">Book a service</Link>
      <div className="pacts">
        <button className="btn soft" onClick={() => setModal('issue')}><Icon n="cam" s={15} />Report an issue</button>
        <button className="btn soft" onClick={() => setModal('transfer')}><Icon n="swap" s={15} />Transfer ownership</button>
        <button className="btn soft" onClick={() => setModal('resale')}><Icon n="tag" s={15} />Share for resale</button>
        <a className="btn soft" href={wa} target="_blank" rel="noreferrer"><WaIcon s={15} />Contact on WhatsApp</a>
      </div>
    </section>}
    <section className="pcard">
      <div className="spread"><span className="label">Warranty</span>{w.active ? <Badge kind="ok">Active</Badge> : <Badge>Expired</Badge>}</div>
      <div className="wbar"><span style={{ width: w.pct + '%' }} /></div>
      <div className="spread xs muted mono"><span>{fmtDate(t.installDate)}</span><span>{w.active ? `${w.left} days left` : 'Ended'} · {fmtDate(w.end)}</span></div>
      <p className="small mut" style={{ marginTop: 10 }}>{t.warrantyMonths}-month frame & bed warranty. Cloth and cushions: 6 months.</p>
    </section>
    <section className="pcard">
      <span className="label">Specification</span>
      <dl className="specs">
        {[['Maker', 'Emerald Billiards (EMRAD)'], ['Model', `${t.model} · ${t.game}`], ['Size', t.size], ['Serial', t.serial], ['Built', fmtDate(t.buildDate)], ['Body', `${t.wood}, solid hardwood`], ['Playing bed', t.bed === 'marble' ? 'Marble' : 'Engineered hardwood'], ...(t.stone ? [['Stone', t.stone]] : []), ['Cloth', t.cloth + ' · worsted wool'], ['Showroom', t.showroom], ['Installed', fmtDate(t.installDate) + ' · ' + t.installer]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <span className="label" style={{ display: 'block', marginTop: 18 }}>Made by</span>
      <div className="crafts">{t.craftsmen.map(c => <span key={c} className="chip">{c}</span>)}</div>
    </section>
    <section className="pcard"><div className="spread"><span className="label">Service history</span><span className="mono xs muted">{t.history.length} entries</span></div><div style={{ marginTop: 16 }} data-testid="timeline"><Timeline t={t} hidePrice={resale} /></div></section>
    <section className="pcard"><span className="label">Ownership</span>
      {resale ? <p className="small" style={{ marginTop: 10 }}>{t.owners.length} verified owner{t.owners.length > 1 ? 's' : ''} since {fmtDate(t.installDate)}. Details private.</p> :
        <div className="owners">{[...t.owners].reverse().map((x, i) => <div key={i}><div className="av">{x.name.split(' ').map(s => s[0]).slice(0, 2).join('')}</div><div><b>{x.name}</b><p className="xs muted">{x.city} · {fmtDate(x.from)}{x.to ? ' – ' + fmtDate(x.to) : ' – today'}</p></div>{i === 0 && <Badge kind="ok">Current</Badge>}</div>)}</div>}
    </section>
    <footer className="pfoot"><span className="mono xs">Table Passport by VUG</span><Link to="/verify" className="xs muted">Verify another table</Link></footer>
    {modal === 'issue' && <IssueModal t={t} onClose={() => setModal('')} />}
    {modal === 'transfer' && <TransferModal t={t} onClose={() => setModal('')} />}
    {modal === 'resale' && <ResaleModal t={t} onClose={() => setModal('')} />}
  </div>
}

function IssueModal({ t, onClose }: { t: Table; onClose: () => void }) {
  const [text, setText] = useState(''); const [ph, setPh] = useState<string[]>([]); const [done, setDone] = useState(false)
  if (done) return <Modal onClose={onClose}><span className="label acc">Issue received</span><h2 style={{ marginTop: 8 }}>Thanks — EMRAD has it.</h2><p className="mut" style={{ marginTop: 8 }}>A technician will reply on WhatsApp within one working day. {ph.length ? `${ph.length} photo${ph.length > 1 ? 's' : ''} attached.` : ''}</p><button className="btn cta" style={{ marginTop: 18 }} onClick={onClose}>Done</button></Modal>
  return <Modal onClose={onClose}><span className="label">Report an issue · {t.serial}</span><h2 style={{ marginTop: 8 }}>What's wrong?</h2>
    <div className="row wrap" style={{ marginTop: 14, gap: 6 }}>{['Ball rolls off line', 'Cloth worn or torn', 'Cushion feels dead', 'Pocket damaged', 'Wood scratch or crack'].map(x => <button key={x} className={`chip ${text === x ? 'on' : ''}`} onClick={() => setText(x)}>{x}</button>)}</div>
    <textarea className="textarea" style={{ marginTop: 12 }} placeholder="Describe it in a sentence" value={text} onChange={e => setText(e.target.value)} />
    <span className="label" style={{ display: 'block', margin: '14px 0 8px' }}>Photos</span><Photos value={ph} onChange={setPh} />
    <button className="btn cta" style={{ marginTop: 18, width: '100%' }} disabled={!text} onClick={() => { update(d => { const x = d.tables.find(y => y.serial === t.serial)!; d.issues.unshift({ id: 'i' + Date.now(), serial: t.serial, at: Date.now() + d.offset, text, photo: ph[0] }); x.history.push({ id: 'is' + Date.now(), date: Date.now() + d.offset, type: 'issue', title: 'Issue reported: ' + text, by: 'Owner', photo: ph[0] }) }); setDone(true) }}>Send to EMRAD</button></Modal>
}
function TransferModal({ t, onClose }: { t: Table; onClose: () => void }) {
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [done, setDone] = useState(false)
  if (done) return <Modal onClose={onClose}><span className="label acc">Transfer started</span><h2 style={{ marginTop: 8 }}>{name} will get a WhatsApp link to accept.</h2><p className="mut" style={{ marginTop: 8 }}>EMRAD confirms the transfer. The passport, history and remaining warranty move to the new owner; your details are removed from their view.</p><button className="btn cta" style={{ marginTop: 18 }} onClick={onClose}>Done</button></Modal>
  return <Modal onClose={onClose}><span className="label">Transfer ownership · {t.serial}</span><h2 style={{ marginTop: 8 }}>Who is the new owner?</h2>
    <div className="stack" style={{ marginTop: 14 }}><label className="field"><span>Full name</span><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kemi Adeleke" /></label><label className="field"><span>WhatsApp number</span><input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 …" /></label></div>
    <button className="btn cta" style={{ marginTop: 18, width: '100%' }} disabled={!name || phone.length < 8} onClick={() => { update(d => { d.transfers.unshift({ id: 'x' + Date.now(), serial: t.serial, from: owner(t).name, to: name, phone, at: Date.now() + d.offset, status: 'pending' }) }); setDone(true) }}>Start transfer</button></Modal>
}
function ResaleModal({ t, onClose }: { t: Table; onClose: () => void }) {
  const [price, setPrice] = useState(t.resale?.price ? String(t.resale.price) : ''); const [note, setNote] = useState(t.resale?.note || ''); const [done, setDone] = useState(!!t.resale)
  const url = baseUrl() + '#/r/' + t.serial
  if (done) return <Modal onClose={onClose}><span className="label acc">Resale link ready</span><h2 style={{ marginTop: 8 }}>Share your table's verified history.</h2>
    <div className="row" style={{ marginTop: 16, alignItems: 'flex-start' }}><Qr text={url} size={110} /><div className="stack" style={{ gap: 8, minWidth: 0 }}><code className="xs" style={{ wordBreak: 'break-all' }}>{url}</code><p className="xs mut">Buyers see specs, warranty and service history. Your name and number stay private.</p></div></div>
    <div className="row wrap" style={{ marginTop: 16 }}><Link className="btn cta" to={'/r/' + t.serial} onClick={onClose}>Open public view</Link><button className="btn ghost" onClick={() => { update(d => { d.tables.find(y => y.serial === t.serial)!.resale = null }); onClose() }}>Remove listing</button></div></Modal>
  return <Modal onClose={onClose}><span className="label">Share for resale</span><h2 style={{ marginTop: 8 }}>List it with proof.</h2>
    <div className="stack" style={{ marginTop: 14 }}><label className="field"><span>Asking price (₦)</span><input className="input" inputMode="numeric" value={price} onChange={e => setPrice(e.target.value.replace(/\D/g, ''))} placeholder="3500000" /></label><label className="field"><span>Note for buyers</span><input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Why you're selling" /></label></div>
    <button className="btn cta" style={{ marginTop: 18, width: '100%' }} disabled={!price} onClick={() => { update(d => { d.tables.find(y => y.serial === t.serial)!.resale = { price: Number(price), note: note || 'Well kept.', listedAt: Date.now() + d.offset } }); setDone(true) }}>Create resale link</button></Modal>
}
