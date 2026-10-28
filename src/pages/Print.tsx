import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import Qr from '../components/Qr'
import { Mark, Icon } from '../components/ui'
import { useDB, baseUrl, findTable } from '../lib/data'

export const stickerUrl = (id: string) => baseUrl() + '#/s/' + id
export function StickerResolve() {
  const { id = '' } = useParams(); const db = useDB(); const s = db.stickers.find(x => x.id === id.toUpperCase())
  if (s?.serial) return <Navigate to={'/p/' + s.serial} replace />
  return <div className="pp"><div className="pcard"><span className="label acc">Sticker {id}</span><h2 style={{ marginTop: 8 }}>{s ? 'Not activated yet.' : 'Unknown sticker.'}</h2><p className="mut" style={{ marginTop: 8 }}>{s ? 'This plate is activated by the EMRAD installer at delivery.' : 'This sticker was not issued by EMRAD.'}</p><Link className="btn cta" style={{ marginTop: 16 }} to="/install">Open installer app</Link></div></div>
}
function Label({ id, serial }: { id: string; serial?: string }) {
  return <div className="lbl">
    <Qr text={stickerUrl(id)} size={84} />
    <div className="lbl-t"><div className="lbl-b"><Mark s={12} /><b>EMRAD</b></div><span>TABLE PASSPORT</span><b className="mono">{id}</b><small>{serial || 'Scan to verify & book service'}</small></div>
  </div>
}
export function StickerSheet() {
  const db = useDB(); const [sp] = useSearchParams(); const batch = sp.get('batch') || 'B-2026-04'
  const list = db.stickers.filter(s => s.batch === batch).slice(0, 24)
  return <div className="printpage">
    <div className="noprint printbar"><Link to="/app/stickers" className="btn glass sm">← Back</Link><span className="label">Batch {batch} · {list.length} labels · A4, 3 × 8, 63.5 × 33.9 mm</span><button className="btn cta sm" onClick={() => print()}><Icon n="print" s={14} />Print sheet</button></div>
    <div className="sheet" data-testid="sheet">{list.map(s => <Label key={s.id} id={s.id} serial={s.serial} />)}</div>
  </div>
}
export function PlateMock() {
  const { serial = '' } = useParams(); const db = useDB(); const t = findTable(db, serial)
  if (!t) return <Navigate to="/app/stickers" />
  return <div className="printpage">
    <div className="noprint printbar"><Link to="/app/stickers" className="btn glass sm">← Back</Link><span className="label">Engraved plate · 90 × 40 mm · brushed aluminium</span><button className="btn cta sm" onClick={() => print()}><Icon n="print" s={14} />Print</button></div>
    <div className="plates">
      <div className="plate"><div className="pl-l"><div className="lbl-b"><Mark s={16} /><b>EMERALD BILLIARDS</b></div><span className="pl-s">{t.serial}</span><span className="pl-m">{t.model} · {t.size} · {t.bed === 'marble' ? 'Marble bed' : 'Wood bed'}</span><span className="pl-f">Scan for passport · verify · service</span></div><div className="pl-q"><Qr text={stickerUrl(t.sticker)} size={104} dark="#1b1c1f" light="#e6e7ea" /></div></div>
      <div className="plate dark"><div className="pl-l"><div className="lbl-b"><Mark s={16} /><b>EMERALD BILLIARDS</b></div><span className="pl-s">{t.serial}</span><span className="pl-m">Hand-built in Lagos · {new Date(t.buildDate).getFullYear()}</span><span className="pl-f">Table Passport by VUG</span></div><div className="pl-q"><Qr text={stickerUrl(t.sticker)} size={104} dark="#e6e7ea" light="#141518" /></div></div>
      <p className="mut small" style={{ maxWidth: 520 }}>Two finishes: brushed aluminium for light woods, black anodised for dark. Fixed with screws under the top rail at the foot end; a tamper-evident sticker with the same QR goes inside the frame as backup.</p>
    </div>
  </div>
}
