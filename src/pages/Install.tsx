import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CoLock, Icon, ctaMove } from '../components/ui'
import TableArt from '../components/TableArt'
import Photos from '../components/Photos'
import SignPad from '../components/SignPad'
import { useDB, update, now, DAY, passUrl, first, fmtDate, type Table } from '../lib/data'

const STEPS = ['Sticker', 'Order', 'Spec', 'Photos', 'Level', 'Owner', 'Sign']
export default function Install() {
  const db = useDB()
  const [step, setStep] = useState(0); const [sticker, setSticker] = useState(''); const [oid, setOid] = useState('')
  const [specOk, setSpecOk] = useState(false); const [photos, setPhotos] = useState<string[]>([]); const [lv, setLv] = useState(['0.1', '0.2', '0.1', '0.1'])
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [consent, setConsent] = useState(false); const [sig, setSig] = useState(''); const [done, setDone] = useState<Table | null>(null)
  const free = db.stickers.filter(s => !s.serial)
  const st = db.stickers.find(s => s.id === sticker.trim().toUpperCase())
  const stErr = sticker && (!st ? 'Sticker not found in any EMRAD batch' : st.serial ? 'Already assigned to ' + st.serial : '')
  const orders = db.orders.filter(o => !o.done); const o = db.orders.find(x => x.id === oid)
  const ok = [!!st && !stErr, !!o, specOk, photos.length > 0, lv.every(v => v !== '' && !isNaN(+v)), name.length > 1 && phone.replace(/\D/g, '').length >= 10 && consent, !!sig][step]
  const register = () => {
    if (!o || !st) return
    let tbl: Table | null = null
    update(d => {
      const n = now(d)
      const t: Table = { serial: o.serial, sticker: st.id, model: o.model, game: o.game, size: o.size, bed: o.bed, stone: o.stone, wood: o.wood, woodHex: o.woodHex, cloth: o.cloth, clothHex: o.clothHex, craftsmen: ['Musa A. (frame)', o.bed === 'marble' ? 'Emeka O. (marble bed)' : 'Kunle B. (bed)', 'Ifeanyi C. (cloth)'], buildDate: n - 21 * DAY, installDate: n, installer: 'Tobi Adewale', showroom: o.showroom, warrantyMonths: o.game === 'Snooker' ? 24 : 12, status: 'active', owners: [{ name, phone, city: o.city, from: n }], levels: lv.map(Number), photos, signature: sig, resale: null,
        history: [{ id: 'b' + o.id, date: n - 21 * DAY, type: 'build', title: 'Built at EMRAD workshop', note: 'Frame, bed and cloth fitted and inspected.', by: 'Workshop · Ikeja' }, { id: 'd' + o.id, date: n - 2 * 36e5, type: 'delivery', title: 'Delivered', by: o.showroom }, { id: 'i' + o.id, date: n, type: 'install', title: 'Installed & levelled', note: `Level readings ${lv.join(' / ')} mm. Owner signed off.`, by: 'Tobi Adewale', photo: photos[0] }] }
      d.tables.unshift(t); d.orders.find(x => x.id === o.id)!.done = true; d.stickers.find(s => s.id === st.id)!.serial = o.serial; tbl = t
    })
    setDone(tbl)
  }
  if (done) { const msg = `Hi ${first(done.owners[0].name)}, welcome to EMRAD. Your ${done.model} (${done.serial}) is registered. Your table passport — warranty, care and service history — is here: ${passUrl(done.serial)}. Reply STOP to opt out.`
    return <div className="pp inst">
      <div className="ptop"><CoLock /><span className="label">Installer</span></div>
      <section className="pcard cert" style={{ textAlign: 'center' }} data-testid="registered">
        <div className="okring"><Icon n="check" s={30} sw={2} /></div>
        <span className="label acc" style={{ display: 'block', marginTop: 14 }}>Passport activated</span>
        <h2 style={{ marginTop: 8 }}>{done.model} registered to {done.owners[0].name}.</h2>
        <p className="mono xs muted" style={{ marginTop: 6 }}>{done.serial} · sticker {done.sticker} · {fmtDate(done.installDate)}</p>
      </section>
      <section className="pcard"><span className="label">WhatsApp sent to {done.owners[0].phone} · simulated</span>
        <div className="wa"><div className="wa-h"><div className="av ink">EM</div><div><b>Emerald Billiards</b><small>Business account</small></div></div><div className="wa-b"><div className="wa-m">{msg}<span>{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} ✓✓</span></div></div></div>
      </section>
      <div className="stack"><Link className="btn cta big" to={'/p/' + done.serial} data-testid="open-passport">Open the passport</Link><button className="btn soft" onClick={() => { setDone(null); setStep(0); setSticker(''); setOid(''); setSpecOk(false); setPhotos([]); setName(''); setPhone(''); setConsent(false); setSig('') }}>Register another table</button></div>
    </div> }
  return <div className="pp inst">
    <div className="ptop"><CoLock /><span className="label">Installer · Tobi A.</span></div>
    <div className="isteps">{STEPS.map((s, i) => <button key={s} className={i < step ? 'past' : i === step ? 'cur' : ''} onClick={() => i < step && setStep(i)}><i />{s}</button>)}</div>
    <section className="pcard fade-in" key={step}>
      <span className="label">Step {step + 1} of {STEPS.length}</span>
      {step === 0 && <><h2 className="ih">Scan the plate sticker</h2><p className="mut small">The QR sticker goes under the top rail, foot end.</p>
        <div className="scanv sm" style={{ marginTop: 14 }}><i /><span className="label" style={{ color: '#fff' }}>Camera simulated</span></div>
        <label className="field" style={{ marginTop: 14 }}><span>Or enter the sticker ID</span><input className="input mono" value={sticker} onChange={e => setSticker(e.target.value)} placeholder="TP-001231" data-testid="sticker" /></label>
        {stErr ? <p className="small" style={{ color: 'var(--acc)', marginTop: 8 }}>{stErr}</p> : st && <p className="small" style={{ color: 'var(--green)', marginTop: 8 }}>Sticker {st.id} · batch {st.batch} · unassigned ✓</p>}
        <div className="row wrap" style={{ marginTop: 10, gap: 6 }}>{free.slice(0, 3).map(s => <button key={s.id} className="chip" onClick={() => setSticker(s.id)}>Scan {s.id}</button>)}</div></>}
      {step === 1 && <><h2 className="ih">Which order is this?</h2><div className="stack" style={{ marginTop: 12 }}>{orders.map(x => <button key={x.id} className={`svc ${oid === x.id ? 'on' : ''}`} onClick={() => setOid(x.id)} data-testid={'order-' + x.id}><div className="spread"><b>{x.customer}</b><span className="mono xs">{x.id}</span></div><p className="xs">{x.model} · {x.size} · {x.bed} bed · {x.city}</p></button>)}{!orders.length && <p className="mut">No open orders.</p>}</div></>}
      {step === 2 && o && <><h2 className="ih">Confirm the table</h2><div style={{ margin: '12px 0' }}><TableArt wood={o.woodHex} cloth={o.clothHex} game={o.game} bed={o.bed} /></div>
        <dl className="specs">{[['Serial', o.serial], ['Model', `${o.model} · ${o.size}`], ['Wood', o.wood], ['Bed', o.bed === 'marble' ? 'Marble · ' + o.stone : 'Wood'], ['Cloth', o.cloth]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <label className="check"><input type="checkbox" checked={specOk} onChange={e => setSpecOk(e.target.checked)} data-testid="specok" />Table on site matches this spec</label></>}
      {step === 3 && <><h2 className="ih">Install photos</h2><p className="mut small">Whole table, plate, and the room. Stored on the passport.</p><div style={{ marginTop: 14 }}><Photos value={photos} onChange={setPhotos} /></div>
        <button className="btn ghost sm" style={{ marginTop: 12 }} onClick={() => setPhotos([...photos, sample(o?.clothHex || '#1f6b3a', o?.woodHex || '#6b3423')])}>Use sample photo</button></>}
      {step === 4 && <><h2 className="ih">Level readings</h2><p className="mut small">Digital level at the four corners, in mm. Target ±0.3.</p>
        <div className="levels">{['Head left', 'Head right', 'Foot left', 'Foot right'].map((k, i) => <label key={k} className="field"><span>{k}</span><input className="input mono" inputMode="decimal" value={lv[i]} onChange={e => setLv(lv.map((v, j) => j === i ? e.target.value : v))} /><em className={Math.abs(+lv[i]) <= .3 ? 'okt' : 'bad'}>{Math.abs(+lv[i]) <= .3 ? 'In tolerance' : 'Adjust'}</em></label>)}</div></>}
      {step === 5 && <><h2 className="ih">Owner details</h2><div className="stack" style={{ marginTop: 12 }}>
        <label className="field"><span>Owner name</span><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder={o?.customer} data-testid="oname" /></label>
        <label className="field"><span>WhatsApp number</span><input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 803 000 0000" inputMode="tel" data-testid="ophone" /></label>
        {o && !name && <button className="chip" onClick={() => { setName(o.customer); setPhone('+234 803 410 2231') }}>Use order contact · {o.customer}</button>}
        <label className="check"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} data-testid="consent" />Owner agrees to receive care reminders and service messages from EMRAD on WhatsApp. They can opt out any time.</label></div></>}
      {step === 6 && <><h2 className="ih">Owner signs off</h2><p className="mut small">“The table was delivered, installed and levelled to my satisfaction.”</p><div style={{ marginTop: 12 }}><SignPad onChange={setSig} /></div></>}
    </section>
    <div className="bfoot">
      <button className="btn soft" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
      {step < 6 ? <button className="btn cta big" disabled={!ok} onClick={() => setStep(step + 1)} data-testid="next">Continue</button> : <button className="btn cta big" disabled={!ok} onClick={register} onMouseMove={ctaMove} data-testid="register">Register & activate</button>}
    </div>
  </div>
}
function sample(cloth: string, wood: string) { const c = document.createElement('canvas'); c.width = 480; c.height = 320; const g = c.getContext('2d')!; const gr = g.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, '#e9e4dc'); gr.addColorStop(1, '#bfb6a8'); g.fillStyle = gr; g.fillRect(0, 0, 480, 320); g.fillStyle = wood; g.beginPath(); g.moveTo(70, 150); g.lineTo(410, 150); g.lineTo(460, 250); g.lineTo(20, 250); g.fill(); g.fillStyle = cloth; g.beginPath(); g.moveTo(88, 160); g.lineTo(392, 160); g.lineTo(432, 238); g.lineTo(48, 238); g.fill(); g.fillStyle = wood; g.fillRect(40, 250, 18, 50); g.fillRect(422, 250, 18, 50); g.fillStyle = '#fff'; g.font = '14px monospace'; g.fillText('INSTALL PHOTO · SAMPLE', 16, 24); return c.toDataURL('image/jpeg', .8) }
