import { useLocation, useNavigate } from 'react-router-dom'
import { usePref, setPref, get } from '../lib/data'
import { Icon } from './ui'

const lastSerial = () => get().orders.find(o => o.done)?.serial || 'EMR-SN-24-0117'
const STEPS: { to: () => string; t: string; d: string; say: string }[] = [
  { to: () => '/', t: 'The idea', d: 'Start on the Table Passport page. Every EMRAD table gets a QR plate under the rail that opens its own passport.', say: '"A table is a 20-year object. Today the relationship ends at delivery. Table Passport keeps it going."' },
  { to: () => '/install', t: 'Installer registers the table', d: 'On a phone-sized window: enter sticker TP-001231, pick order ORD-1042, confirm spec, add a photo, level readings, owner + WhatsApp, sign, Register.', say: '"At delivery our installer spends two minutes. The table is now registered to its owner."' },
  { to: () => '/p/' + lastSerial(), t: 'The owner\'s passport', d: 'This is what the owner sees when they scan the plate. Show the authenticity badge, specs, warranty bar and the timeline.', say: '"It feels like a certificate for a luxury watch — maker, materials, craftsmen, warranty, every service."' },
  { to: () => '/app/reminders', t: 'Simulate six months', d: 'In the dashboard Reminders view, press "Simulate time: +6 months". Rules fire for every table that crossed a milestone.', say: '"Nobody has to remember. The rule sends the reminder on the right day."' },
  { to: () => '/app/reminders', t: 'The WhatsApp reminder', d: 'The preview shows the exact message with a unique link. Click the link — it opens the booking page already filled in.', say: '"One message, one link. We already know the table and the owner."' },
  { to: () => '/app/reminders', t: 'One-tap booking', d: 'On the booking page pick a service (try Re-cloth to choose a colour), pick a slot and confirm.', say: '"No forms. The owner taps a time and it\'s booked — that\'s recurring service income."' },
  { to: () => '/app/bookings', t: 'It lands in the dashboard', d: 'The new booking appears here live (keep this tab open in a second window). Assign a technician.', say: '"The service desk sees every request with the full table history beside it."' },
  { to: () => '/app/bookings', t: 'Technician completes the job', d: 'Press "Mark done". The job is written into the table\'s permanent service history.', say: '"Every job becomes proof of care — which matters on the day the table is sold."' },
  { to: () => '/p/' + lastSerial(), t: 'History updated', d: 'Back on the passport, the new service sits at the top of the timeline and the next due date has moved.', say: '"The owner sees what was done, by whom and when."' },
  { to: () => '/verify', t: 'Is it genuine?', d: 'Check EMR-SN-24-0117 (genuine), then FAKE-1234 (not found) and the stolen example. Unknown scans show up under Authenticity alerts.', say: '"Fakes are a real problem. A serial that isn\'t in our registry is flagged straight away."' },
  { to: () => '/r/EMR-SN-24-0117', t: 'Resale & transfer', d: 'The public resale view shows verified history without private owner data. Ownership transfer moves the passport to the buyer.', say: '"A verified history makes a used EMRAD table worth more, and keeps the new owner in our service loop."' },
]
export default function Tour() {
  const open = usePref('tourOpen', '0') === '1'
  const i = Math.min(STEPS.length - 1, Number(usePref('tourStep', '0')))
  const nav = useNavigate(); const loc = useLocation(); const s = STEPS[i]
  const go = (n: number) => { setPref('tourStep', String(n)); nav(STEPS[n].to()) }
  return <div className="noprint">
    {open && <div className="tour" role="dialog" aria-label="Demo tour">
      <div className="spread"><span className="label">Demo tour · {i + 1} / {STEPS.length}</span><button className="icon-btn" style={{ color: 'var(--inv-mut)' }} onClick={() => setPref('tourOpen', '0')} aria-label="Close tour"><Icon n="x" /></button></div>
      <h3>{s.t}</h3><p>{s.d}</p>
      <div className="say"><span className="label" style={{ display: 'block', marginBottom: 4 }}>Say</span>{s.say}</div>
      <div className="prog">{STEPS.map((_, j) => <i key={j} className={j <= i ? 'on' : ''} />)}</div>
      <div className="spread">
        <button className="btn glass sm" onClick={() => go(Math.max(0, i - 1))} disabled={i === 0}>Back</button>
        {loc.pathname !== s.to() && <button className="btn glass sm" onClick={() => nav(s.to())}>Go to page</button>}
        {i < STEPS.length - 1 ? <button className="btn cta sm" onClick={() => go(i + 1)}>Next step</button> : <button className="btn cta sm" onClick={() => { setPref('tourOpen', '0'); setPref('tourStep', '0') }}>Finish</button>}
      </div>
    </div>}
    <button className="btn cta sm tourfab" onClick={() => setPref('tourOpen', open ? '0' : '1')} data-testid="tour"><Icon n="play" s={12} />Demo tour</button>
  </div>
}
