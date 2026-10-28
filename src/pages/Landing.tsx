import { Link } from 'react-router-dom'
import { Lockup, CoLock, Icon, ctaMove } from '../components/ui'
import TableArt from '../components/TableArt'
import Qr from '../components/Qr'
import { passUrl, reset } from '../lib/data'

const steps = [
  ['01', 'Plate on every table', 'A QR plate goes under the rail at the workshop. It carries the serial and links to the table\'s passport.'],
  ['02', 'Registered at delivery', 'The installer scans the plate, confirms the spec, records level readings and adds the owner\'s WhatsApp with consent.'],
  ['03', 'Reminders on time', '6 months, 12 months, warranty ending: the owner gets a WhatsApp message with a link that already knows their table.'],
  ['04', 'One tap to book', 'They pick a service and a slot. The job lands on EMRAD\'s service desk and, once done, in the table\'s history.'],
]
export default function Landing() {
  return <div className="landing">
    <header className="wrap lhdr">
      <Lockup />
      <nav className="lnav"><a href="#how">How it works</a><a href="#value">Benefits</a><a href="#pricing">Pricing</a><Link to="/verify">Verify a table</Link></nav>
      <Link to="/app" className="btn cta sm" onMouseMove={ctaMove}>Open demo <Icon n="arrow" s={14} /></Link>
    </header>
    <section className="wrap lhero">
      <div>
        <span className="label acc">EMRAD × VUG · Product proposal</span>
        <h1 style={{ marginTop: 18 }}>Every EMRAD table, verified for life.</h1>
        <p className="lead" style={{ marginTop: 18 }}>Table Passport gives each snooker and pool table a QR plate and a digital passport: who made it, what it's made of, its warranty and every service since. Owners book care in one tap. EMRAD earns long after the sale.</p>
        <div className="row wrap" style={{ marginTop: 28 }}>
          <Link to="/p/EMR-SN-24-0117" className="btn cta big" style={{ width: 'auto', padding: '0 26px' }} onMouseMove={ctaMove}>See a passport ↗</Link>
          <Link to="/install" className="btn glass">Register a table</Link>
          <Link to="/app" className="btn glass">EMRAD dashboard</Link>
        </div>
        <div className="row wrap" style={{ marginTop: 28, gap: 20 }}><CoLock /><span className="label">Demo build · fictional data</span></div>
      </div>
      <div className="lvis">
        <div className="lphone">
          <div className="lph-top"><span className="label">Table passport</span><span className="vbadge sm"><Icon n="shield" s={12} />Genuine EMRAD</span></div>
          <TableArt wood="#6b3423" cloth="#1f6b3a" />
          <div className="lph-name">Heritage 12<small>EMR-SN-24-0117</small></div>
          <div className="lph-rows"><div><span className="label">Bed</span>Marble · 3-piece</div><div><span className="label">Warranty</span>19 months left</div><div><span className="label">Next care</span>Levelling · in 18 days</div></div>
          <div className="btn cta" style={{ width: '100%' }}>Book a service</div>
        </div>
        <div className="lplate"><Qr text={passUrl('EMR-SN-24-0117')} size={74} /><div><span className="label">Scan · Table passport</span><b>EMR-SN-24-0117</b><small>Emerald Billiards · Lagos</small></div></div>
      </div>
    </section>
    <section id="how" className="wrap lsec">
      <span className="label">How it works</span><h2 style={{ marginTop: 10 }}>Four moments, one record.</h2>
      <div className="grid g4" style={{ marginTop: 28 }}>{steps.map(s => <div className="card" key={s[0]}><span className="label acc">{s[0]}</span><h3 style={{ marginTop: 26 }}>{s[1]}</h3><p className="mut small" style={{ marginTop: 8 }}>{s[2]}</p></div>)}</div>
    </section>
    <section id="value" className="wrap lsec">
      <div className="grid g2">
        <div className="card"><span className="label">For EMRAD</span><h2 style={{ marginTop: 10 }}>From one sale to a relationship.</h2>
          <ul className="ticks">{['Recurring service income from tables already sold', 'Reminders that book themselves — no call lists', 'A live registry of every table, owner and warranty', 'Fakes flagged: unknown serials are logged with place and time', 'Resale keeps the new owner in EMRAD\'s service loop'].map(x => <li key={x}><Icon n="check" s={14} />{x}</li>)}</ul></div>
        <div className="card"><span className="label">For owners</span><h2 style={{ marginTop: 10 }}>Proof of what they own.</h2>
          <ul className="ticks">{['A certificate for the table: maker, materials, craftsmen', 'Warranty status at a glance', 'Service in one tap, on WhatsApp', 'Full, verified history when they sell', 'A quick way to check a used table is genuine'].map(x => <li key={x}><Icon n="check" s={14} />{x}</li>)}</ul></div>
      </div>
    </section>
    <section id="pricing" className="wrap lsec">
      <span className="label">Example business model</span><h2 style={{ marginTop: 10 }}>Priced to pay for itself with a few services a month.</h2>
      <p className="lead" style={{ marginTop: 10 }}>Illustrative figures for discussion. Final terms would be agreed with EMRAD.</p>
      <div className="grid g3" style={{ marginTop: 28 }}>
        <div className="card"><span className="label">Setup</span><div className="price">₦450,000</div><p className="mut small">One-off. Registry, branding, plate design, import of existing customers, installer training.</p></div>
        <div className="card"><span className="label">Platform</span><div className="price">₦95,000<small>/month</small></div><p className="mut small">Unlimited passports, reminders, dashboard, verification page. WhatsApp message costs passed through.</p></div>
        <div className="card"><span className="label">Plates</span><div className="price">₦2,500<small>/table</small></div><p className="mut small">Engraved aluminium QR plate with tamper-evident sticker backup.</p></div>
      </div>
      <div className="card inv" style={{ marginTop: 16 }}><div className="grid g3">
        <div><span className="label">Example</span><p style={{ marginTop: 8 }}>400 tables registered · 35% book a ₦35,000 levelling each year · 8% a ₦280,000 re-cloth</p></div>
        <div><span className="label">Service revenue / year</span><div className="price" style={{ color: '#fff' }}>₦13.9m</div></div>
        <div><span className="label">Platform cost / year</span><div className="price" style={{ color: '#fff' }}>₦1.1m</div></div>
      </div></div>
    </section>
    <section className="wrap lsec">
      <span className="label">Try the demo</span><h2 style={{ marginTop: 10 }}>Every screen, clickable.</h2>
      <div className="grid g3 demo-links" style={{ marginTop: 28 }}>
        {[['/install', 'Installer app', 'Register a new table at delivery. Mobile.'], ['/p/EMR-SN-24-0117', 'Owner passport', 'What the owner sees after a scan. Mobile.'], ['/app/reminders', 'Reminders', 'Simulate six months and see the WhatsApp message.'], ['/app', 'EMRAD dashboard', 'Registry, bookings, technicians, alerts.'], ['/verify', 'Authenticity check', 'Genuine, not found, or reported stolen.'], ['/print/stickers', 'QR sticker sheet', 'A printable batch of plates.']].map(([to, t, d]) => <Link to={to} key={to} className="card tight dl"><div className="spread"><h3>{t}</h3><Icon n="arrow" /></div><p className="mut small" style={{ marginTop: 6 }}>{d}</p></Link>)}
      </div>
    </section>
    <section className="inv lcta"><div className="wrap"><span className="label">Next</span><h2 style={{ marginTop: 12, maxWidth: '24ch' }}>Start with the tables EMRAD delivers next month.</h2><p className="lead" style={{ marginTop: 12 }}>Plates at the workshop, registration at delivery, the first reminders six months later. Existing customers can be imported.</p><div className="row wrap" style={{ marginTop: 24 }}><Link className="btn cta" to="/app" onMouseMove={ctaMove}>Open the dashboard ↗</Link><button className="btn glass" style={{ color: '#fff' }} onClick={() => { reset(); location.reload() }}>Reset demo data</button></div></div></section>
    <footer className="wrap lfoot"><Lockup /><span className="mut small">Table Passport is a VUG Technology product, proposed for Emerald Billiards (emrad.ng). Demo with fictional data — nothing is sent.</span></footer>
  </div>
}
