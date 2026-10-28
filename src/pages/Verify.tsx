import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CoLock, Icon, Lockup, ctaMove } from '../components/ui'
import TableArt from '../components/TableArt'
import { useDB, findTable, update, now, fmtDate, warranty, get } from '../lib/data'

export default function Verify() {
  const { serial: ps = '' } = useParams(); const db = useDB(); const nav = useNavigate()
  const [q, setQ] = useState(ps); const [scan, setScan] = useState(false)
  const s = ps.trim().toUpperCase(); const t = s ? findTable(db, s) : undefined
  const state = !s ? '' : !t ? 'unknown' : t.status === 'stolen' ? 'stolen' : 'genuine'
  useEffect(() => { if (!s) return; const d = get(); const tt = findTable(d, s); if (!tt || tt.status === 'stolen') update(x => { x.alerts.unshift({ id: 'a' + Date.now(), serial: s, at: now(x), city: ['Lagos', 'Abuja', 'Onitsha', 'Kano', 'Ibadan'][s.length % 5], result: tt ? 'stolen' : 'unknown', note: 'Checked on the verify page' }) }) }, [s])
  const go = (v: string) => { setScan(false); nav('/verify/' + encodeURIComponent(v.trim().toUpperCase())) }
  return <div className="vpage">
    <header className="wrap lhdr"><Lockup /><CoLock /></header>
    <div className="vwrap">
      <section className="pcard">
        <span className="label">Authenticity check</span>
        <h1 style={{ fontSize: 'clamp(30px,6vw,42px)', marginTop: 10 }}>Is this a genuine EMRAD table?</h1>
        <p className="mut" style={{ marginTop: 10 }}>Enter the serial on the plate under the rail, or scan its QR code.</p>
        <form className="vform" onSubmit={e => { e.preventDefault(); if (q) go(q) }}>
          <input className="input mono" value={q} onChange={e => setQ(e.target.value)} placeholder="EMR-SN-24-0117" data-testid="serial" aria-label="Serial" />
          <button className="btn cta" onMouseMove={ctaMove} data-testid="check">Check</button>
        </form>
        <div className="row wrap" style={{ marginTop: 12, gap: 6 }}>
          <button className="chip" onClick={() => setScan(true)}><Icon n="qr" s={14} />&nbsp;Scan QR</button>
          {[['Genuine', 'EMR-SN-24-0117'], ['Unknown', 'FAKE-1234'], ['Stolen', db.tables.find(x => x.status === 'stolen')?.serial || '']].map(([k, v]) => <button key={k} className="chip" onClick={() => { setQ(v); go(v) }}>Try: {k}</button>)}
        </div>
      </section>
      {scan && <section className="pcard scanbox"><div className="scanv"><i /><span className="label" style={{ color: '#fff' }}>Point at the plate</span></div><p className="xs mut" style={{ marginTop: 10 }}>Camera scanning is simulated in this demo. Tap a plate below.</p><div className="row wrap" style={{ marginTop: 10, gap: 6 }}>{db.tables.slice(0, 3).map(x => <button className="chip" key={x.serial} onClick={() => { setQ(x.serial); go(x.serial) }}>{x.sticker}</button>)}<button className="chip" onClick={() => go('EMR-SN-22-7781')}>Unlabelled plate</button></div></section>}
      {state === 'genuine' && t && <section className="pcard vres ok" data-testid="result-genuine">
        <span className="vbadge"><Icon n="shield" s={13} />Genuine EMRAD · Verified</span>
        <div className="row" style={{ marginTop: 16, alignItems: 'center' }}><div style={{ width: 120, flex: 'none' }}><TableArt wood={t.woodHex} cloth={t.clothHex} game={t.game} /></div><div><h2 style={{ fontSize: 22 }}>{t.model} · {t.size}</h2><p className="mono xs muted">{t.serial}</p><p className="small mut" style={{ marginTop: 4 }}>{t.wood} · {t.bed} bed · built {fmtDate(t.buildDate)}</p></div></div>
        <p className="small" style={{ marginTop: 14 }}>Registered with Emerald Billiards. {t.owners.length} verified owner{t.owners.length > 1 ? 's' : ''}. Warranty {warranty(t, now(db)).active ? 'active' : 'ended'}.</p>
        <Link className="btn cta" style={{ marginTop: 14 }} to={'/r/' + t.serial}>View verified history</Link>
      </section>}
      {state === 'unknown' && <section className="pcard vres bad" data-testid="result-unknown">
        <span className="vbadge bad"><Icon n="alert" s={13} />Not found · possible counterfeit</span>
        <h2 style={{ marginTop: 14 }}>{s} is not in the EMRAD registry.</h2>
        <p className="mut" style={{ marginTop: 8 }}>Genuine tables carry a serial like EMR-SN-24-0117 on an engraved plate. Don't pay for this table until EMRAD confirms it. This check has been logged.</p>
        <a className="btn cta" style={{ marginTop: 14 }} href={`https://wa.me/2348035550000?text=${encodeURIComponent('Please check serial ' + s)}`} target="_blank" rel="noreferrer">Ask EMRAD</a>
      </section>}
      {state === 'stolen' && t && <section className="pcard vres bad" data-testid="result-stolen">
        <span className="vbadge bad"><Icon n="alert" s={13} />Reported stolen</span>
        <h2 style={{ marginTop: 14 }}>This table was reported stolen.</h2>
        <p className="mut" style={{ marginTop: 8 }}>{t.model} · {t.serial}. Please do not buy it. EMRAD has been notified of this check and will contact the registered owner.</p>
      </section>}
    </div>
  </div>
}
