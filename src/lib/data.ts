import { useSyncExternalStore } from 'react'

export type Bed = 'marble' | 'wood'
export type Ev = { id: string; date: number; type: 'build' | 'delivery' | 'install' | 'levelling' | 'recloth' | 'cushions' | 'relocation' | 'full' | 'transfer' | 'issue' | 'inspection'; title: string; note?: string; by?: string; price?: number; photo?: string }
export type Owner = { name: string; phone: string; city: string; from: number; to?: number }
export type Table = {
  serial: string; sticker: string; model: string; game: 'Snooker' | 'Pool'; size: string; bed: Bed; stone?: string
  wood: string; woodHex: string; cloth: string; clothHex: string; craftsmen: string[]; buildDate: number; installDate: number
  installer: string; showroom: string; warrantyMonths: number; status: 'active' | 'stolen'; owners: Owner[]; history: Ev[]
  levels?: number[]; photos?: string[]; signature?: string; resale?: { price: number; listedAt: number; note: string } | null
}
export type Order = { id: string; customer: string; city: string; serial: string; model: string; game: 'Snooker' | 'Pool'; size: string; bed: Bed; stone?: string; wood: string; woodHex: string; cloth: string; clothHex: string; showroom: string; due: number; done?: boolean }
export type Reminder = { id: string; token: string; serial: string; rule: string; sentAt: number; msg: string; status: 'sent' | 'opened' | 'booked' }
export type Booking = { ref: string; serial: string; service: string; cloth?: string; slot: number; price: number; status: 'requested' | 'scheduled' | 'done'; tech?: string; source: 'reminder' | 'passport' | 'dashboard'; createdAt: number; token?: string; fresh?: boolean }
export type Tech = { id: string; name: string; area: string; phone: string; skills: string[] }
export type Alert = { id: string; serial: string; at: number; city: string; result: 'unknown' | 'stolen' | 'genuine'; note?: string }
export type Transfer = { id: string; serial: string; from: string; to: string; phone: string; at: number; status: 'pending' | 'approved' }
export type Sticker = { id: string; batch: string; serial?: string }
export type Rule = { id: string; name: string; months: number; kind: 'after-install' | 'warranty'; on: boolean; template: string }
export type DB = { tables: Table[]; orders: Order[]; reminders: Reminder[]; bookings: Booking[]; techs: Tech[]; alerts: Alert[]; transfers: Transfer[]; stickers: Sticker[]; rules: Rule[]; prices: Record<string, number>; issues: { id: string; serial: string; at: number; text: string; photo?: string }[]; seq: number; offset: number; brand: { name: string; phone: string; color: string } }

export const DAY = 864e5, MONTH = 30.44 * DAY
const P = 'tpassport.v1.'
export const SERVICES: { id: string; t: string; d: string; dur: string }[] = [
  { id: 'levelling', t: 'Levelling & check', d: 'Re-level the bed, check cloth, cushions and pockets.', dur: '1–2 h' },
  { id: 'recloth', t: 'Re-cloth', d: 'New cloth on bed and cushions in the colour you choose.', dur: '4–6 h' },
  { id: 'cushions', t: 'Cushion replacement', d: 'Fit new rubber cushions for a true rebound.', dur: '3–4 h' },
  { id: 'relocation', t: 'Relocation', d: 'Dismantle, move and re-install at a new address.', dur: '1 day' },
  { id: 'full', t: 'Full service', d: 'Levelling, cushions check, cloth clean, rails and pockets.', dur: '3 h' },
]
export const CLOTHS = [['Championship Green', '#1f6b3a'], ['Tournament Blue', '#22528f'], ['Burgundy', '#6d1f2b'], ['Charcoal', '#34373d'], ['Camel', '#a57d4f'], ['Teal', '#16706d']] as const
export const svcName = (id: string) => SERVICES.find(s => s.id === id)?.t || id

/* ---------- seed ---------- */
function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 } }
export function seed(): DB {
  const r = rng(117), now = Date.now(), pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)]
  const names = ['Chinedu Okafor', 'Aisha Bello', 'Tunde Adeyemi', 'Ngozi Eze', 'Ibrahim Musa', 'Folake Adebayo', 'Emeka Nwosu', 'Zainab Lawal', 'The Ikoyi Club', 'Kelechi Obi', 'Bola Ajayi', 'Yusuf Danjuma', 'Grand Oak Lounge', 'Funmi Johnson', 'Segun Bakare', 'Hauwa Sani', 'Obinna Ude', 'Ada Uche', 'Victoria Island Golf Club', 'Rasheed Ogun', 'Amaka Ibe', 'Port Harcourt Club', 'Damilola Peters', 'Musa Garba']
  const cities = ['Lekki, Lagos', 'Ikoyi, Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Victoria Island, Lagos', 'Enugu', 'Kano']
  const showrooms = ['Lagos · Lekki showroom', 'Abuja · Wuse showroom', 'Port Harcourt showroom']
  const woods = [['Mahogany', '#6b3423'], ['Iroko', '#8a5a2b'], ['Walnut', '#4a2f22'], ['Ebony stain', '#241a16'], ['Natural oak', '#b08355']] as const
  const crafts = ['Musa A. (frame)', 'Emeka O. (bed)', 'Kunle B. (cushions)', 'Ifeanyi C. (cloth)', 'Sadiq Y. (finish)']
  const tables: Table[] = []
  for (let i = 0; i < 24; i++) {
    const main = i === 0
    const game: 'Snooker' | 'Pool' = main || r() > .4 ? 'Snooker' : 'Pool'
    const ageM = main ? 5.4 : 1 + r() * 30
    const inst = now - ageM * MONTH, build = inst - (14 + r() * 20) * DAY
    const yr = new Date(build).getFullYear() % 100
    const serial = main ? 'EMR-SN-24-0117' : `EMR-${game === 'Snooker' ? 'SN' : 'PL'}-${yr}-${String(120 + i * 7).padStart(4, '0')}`
    const bed: Bed = main ? 'marble' : r() > .35 ? 'marble' : 'wood'
    const w = main ? woods[0] : pick(woods), c = main ? CLOTHS[0] : pick(CLOTHS)
    const city = main ? 'Lekki, Lagos' : pick(cities)
    const nm = names[i]
    const model = game === 'Snooker' ? pick(['Heritage 12', 'Club Pro 10', 'Regent 12']) : pick(['Lagos 8', 'Lounge 7', 'Atlantic 9'])
    const history: Ev[] = [
      { id: 'e' + i + 'b', date: build, type: 'build', title: 'Built at EMRAD workshop', note: 'Frame, bed and cloth fitted and inspected.', by: 'Workshop · Ikeja' },
      { id: 'e' + i + 'd', date: inst - DAY, type: 'delivery', title: 'Delivered', by: pick(showrooms) },
      { id: 'e' + i + 'i', date: inst, type: 'install', title: 'Installed & levelled', note: 'Bed levelled to ±0.2 mm. Owner shown care basics.', by: 'Tobi Adewale' },
    ]
    const svcTypes: [Ev['type'], string, number][] = [['levelling', 'Levelling & check', 35000], ['full', 'Full service', 85000], ['recloth', 'Re-cloth', 280000], ['cushions', 'Cushion replacement', 180000], ['relocation', 'Relocation', 150000]]
    let t = inst + (5 + r() * 3) * MONTH
    while (t < now - 10 * DAY && !main) { const s = r() > .3 ? svcTypes[Math.floor(r() * 2)] : pick(svcTypes); history.push({ id: 'e' + i + t, date: t, type: s[0], title: s[1], by: pick(['Tobi Adewale', 'Sani Ibrahim', 'Chuka Obi']), price: s[2] }); t += (5 + r() * 6) * MONTH }
    const owners: Owner[] = [{ name: nm, phone: '+234 80' + Math.floor(10000000 + r() * 89999999), city, from: inst }]
    if (i === 5) { owners[0].to = now - 3 * MONTH; owners.push({ name: 'Ladi Kolawole', phone: '+234 803 221 9087', city, from: now - 3 * MONTH }); history.push({ id: 'tr5', date: now - 3 * MONTH, type: 'transfer', title: 'Ownership transferred', note: 'Verified by EMRAD. History carried over.' }) }
    if (main) owners[0].phone = '+234 803 555 0117'
    tables.push({ serial, sticker: 'TP-' + String(1000 + i).padStart(6, '0'), model, game, size: game === 'Snooker' ? (model.includes('10') ? '10 ft' : '12 ft') : model.replace(/\D/g, '') + ' ft', bed, stone: bed === 'marble' ? pick(['Italian slate-grade marble, 3-piece', 'Nigerian marble, 3-piece · 45 mm']) : undefined, wood: w[0], woodHex: w[1], cloth: c[0], clothHex: c[1], craftsmen: [pick(crafts), pick(crafts.filter(x => x.includes('bed'))) , crafts[3]].filter((v, j, a) => a.indexOf(v) === j), buildDate: build, installDate: inst, installer: 'Tobi Adewale', showroom: main ? showrooms[0] : pick(showrooms), warrantyMonths: game === 'Snooker' ? 24 : 12, status: i === 17 ? 'stolen' : 'active', owners, history, levels: [0.1, 0.2, 0.1, 0.0], resale: i === 8 ? { price: 4200000, listedAt: now - 9 * DAY, note: 'Moving abroad. Serviced regularly.' } : null })
  }
  if (true) { const m = tables[0]; m.craftsmen = ['Musa A. (frame)', 'Emeka O. (marble bed)', 'Ifeanyi C. (cloth)']; m.model = 'Heritage 12'; m.size = '12 ft'; m.stone = 'Italian marble, 3-piece · 45 mm'; m.history.push({ id: 'm1', date: m.installDate + 40 * DAY, type: 'inspection', title: 'Free 30-day check', note: 'Cushions settled; no action needed.', by: 'Sani Ibrahim', price: 0 }) }
  const orders: Order[] = [
    { id: 'ORD-1042', customer: 'Adaeze Bello', city: 'Ikoyi, Lagos', serial: 'EMR-SN-26-0231', model: 'Regent 12', game: 'Snooker', size: '12 ft', bed: 'marble', stone: 'Italian marble, 3-piece · 45 mm', wood: 'Walnut', woodHex: '#4a2f22', cloth: 'Tournament Blue', clothHex: '#22528f', showroom: 'Lagos · Lekki showroom', due: now },
    { id: 'ORD-1043', customer: 'Kayode Martins', city: 'Abuja', serial: 'EMR-PL-26-0232', model: 'Lounge 7', game: 'Pool', size: '7 ft', bed: 'wood', wood: 'Natural oak', woodHex: '#b08355', cloth: 'Burgundy', clothHex: '#6d1f2b', showroom: 'Abuja · Wuse showroom', due: now + DAY },
    { id: 'ORD-1044', customer: 'Eko Social Club', city: 'Victoria Island, Lagos', serial: 'EMR-SN-26-0233', model: 'Club Pro 10', game: 'Snooker', size: '10 ft', bed: 'marble', stone: 'Nigerian marble, 3-piece · 45 mm', wood: 'Mahogany', woodHex: '#6b3423', cloth: 'Championship Green', clothHex: '#1f6b3a', showroom: 'Lagos · Lekki showroom', due: now + 3 * DAY },
  ]
  const stickers: Sticker[] = tables.map(t => ({ id: t.sticker, batch: 'B-2024-01', serial: t.serial }))
  for (let i = 0; i < 24; i++) stickers.push({ id: 'TP-' + String(1231 + i).padStart(6, '0'), batch: 'B-2026-04' })
  const techs: Tech[] = [
    { id: 't1', name: 'Tobi Adewale', area: 'Lagos Island & Lekki', phone: '+234 802 114 2201', skills: ['Install', 'Levelling', 'Re-cloth'] },
    { id: 't2', name: 'Sani Ibrahim', area: 'Abuja & North', phone: '+234 806 320 4410', skills: ['Levelling', 'Cushions', 'Relocation'] },
    { id: 't3', name: 'Chuka Obi', area: 'Port Harcourt & East', phone: '+234 809 551 7302', skills: ['Re-cloth', 'Full service'] },
    { id: 't4', name: 'Bayo Lawal', area: 'Lagos Mainland & Ibadan', phone: '+234 813 640 9921', skills: ['Install', 'Relocation'] },
  ]
  const bookings: Booking[] = [
    { ref: 'SV-2081', serial: tables[3].serial, service: 'levelling', slot: dayAt(now + 2 * DAY, 10), price: 35000, status: 'scheduled', tech: 't1', source: 'reminder', createdAt: now - 3 * DAY },
    { ref: 'SV-2082', serial: tables[7].serial, service: 'recloth', cloth: 'Tournament Blue', slot: dayAt(now + 4 * DAY, 9), price: 280000, status: 'requested', source: 'passport', createdAt: now - DAY },
    { ref: 'SV-2079', serial: tables[11].serial, service: 'full', slot: dayAt(now - 2 * DAY, 13), price: 85000, status: 'done', tech: 't3', source: 'reminder', createdAt: now - 9 * DAY },
  ]
  const reminders: Reminder[] = [3, 11, 14, 19, 21, 6, 9].map((n, j) => ({ id: 'r' + j, token: 'seed' + j, serial: tables[n].serial, rule: j % 3 ? '6-month levelling & cloth check' : '12-month service', sentAt: now - (2 + j * 3) * DAY, msg: '', status: j < 3 ? 'booked' : j < 5 ? 'opened' : 'sent' }))
  return {
    tables, orders, reminders, bookings, techs, stickers, seq: 2083, offset: 0,
    alerts: [
      { id: 'a1', serial: 'EMR-SN-23-9921', at: now - 6 * DAY, city: 'Onitsha', result: 'unknown', note: 'Seller listing on a marketplace' },
      { id: 'a2', serial: tables[17].serial, at: now - 2 * DAY, city: 'Ibadan', result: 'stolen', note: 'Reported stolen by owner' },
      { id: 'a3', serial: 'EMRAD-12FT-001', at: now - 13 * DAY, city: 'Aba', result: 'unknown' },
    ],
    transfers: [{ id: 'x1', serial: tables[5].serial, from: names[5], to: 'Ladi Kolawole', phone: '+234 803 221 9087', at: now - 3 * MONTH, status: 'approved' }],
    rules: [
      { id: 'm6', name: '6-month levelling & cloth check', months: 6, kind: 'after-install', on: true, template: 'Hi {first}, your EMRAD {model} is 6 months old. A quick levelling and cloth check keeps it playing true. Book in one tap: {link}' },
      { id: 'm12', name: '12-month service', months: 12, kind: 'after-install', on: true, template: 'Hi {first}, it has been a year with your EMRAD {model}. We recommend a full service. Pick a time: {link}' },
      { id: 'm24', name: '24-month re-cloth check', months: 24, kind: 'after-install', on: true, template: 'Hi {first}, after two years most cloths need a refresh. See colours and book: {link}' },
      { id: 'wx', name: 'Warranty expiring (30 days before)', months: -1, kind: 'warranty', on: true, template: 'Hi {first}, the warranty on your EMRAD {model} ends on {date}. Book a check while it is still covered: {link}' },
    ],
    prices: { levelling: 35000, recloth: 280000, cushions: 180000, relocation: 150000, full: 85000 },
    issues: [], brand: { name: 'Emerald Billiards (EMRAD)', phone: '2348035550000', color: '#d5001c' },
  }
}
export function dayAt(t: number, h: number) { const d = new Date(t); d.setHours(h, 0, 0, 0); return d.getTime() }

/* ---------- store ---------- */
const ls = new Set<() => void>(); let cache: { raw: string | null; v: DB } | null = null
export function get(): DB {
  let raw = localStorage.getItem(P + 'db')
  if (!raw) { raw = JSON.stringify(seed()); localStorage.setItem(P + 'db', raw) }
  if (cache && cache.raw === raw) return cache.v
  cache = { raw, v: JSON.parse(raw) }; return cache.v
}
export function update(fn: (d: DB) => void) { const d = structuredClone(get()); fn(d); localStorage.setItem(P + 'db', JSON.stringify(d)); emit() }
export function reset() { Object.keys(localStorage).filter(k => k.startsWith(P)).forEach(k => localStorage.removeItem(k)); emit() }
function emit() { ls.forEach(l => l()) }
function sub(cb: () => void) { ls.add(cb); const s = (e: StorageEvent) => { if (!e.key || e.key.startsWith(P)) cb() }; addEventListener('storage', s); return () => { ls.delete(cb); removeEventListener('storage', s) } }
export const useDB = () => useSyncExternalStore(sub, get)
export const getPref = (k: string, d = '') => localStorage.getItem(P + 'pref.' + k) ?? d
export const setPref = (k: string, v: string) => { localStorage.setItem(P + 'pref.' + k, v); emit() }
export const usePref = (k: string, d = '') => useSyncExternalStore(sub, () => getPref(k, d))
export const now = (d: DB = get()) => Date.now() + d.offset
export const tok = () => Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6)

/* ---------- logic ---------- */
export const findTable = (d: DB, s: string) => d.tables.find(t => t.serial.toUpperCase() === s.trim().toUpperCase())
export const owner = (t: Table) => t.owners[t.owners.length - 1]
export const first = (n: string) => n.startsWith('The ') || /Club|Lounge/.test(n) ? n : n.split(' ')[0]
export function warranty(t: Table, n: number) { const end = t.installDate + t.warrantyMonths * MONTH; return { end, pct: Math.max(0, Math.min(100, (n - t.installDate) / (end - t.installDate) * 100)), active: n < end, left: Math.max(0, Math.round((end - n) / DAY)) } }
const careTypes = ['levelling', 'full', 'recloth', 'install', 'inspection']
export function nextDue(t: Table, n: number) {
  const last = Math.max(...t.history.filter(e => careTypes.includes(e.type) && e.date <= n).map(e => e.date))
  const due = last + 6 * MONTH
  return { due, overdue: due < n, days: Math.round((due - n) / DAY), what: 'Levelling & cloth check' }
}
export function waLink(phone: string, text: string) { return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}` }
export const baseUrl = () => location.origin + location.pathname.replace(/index\.html$/, '')
export const bookUrl = (token: string) => baseUrl() + '#/b/' + token
export const passUrl = (serial: string) => baseUrl() + '#/p/' + serial
export function fillTpl(tpl: string, t: Table, link: string) { const o = owner(t); return tpl.replace('{first}', first(o.name)).replace('{model}', t.model).replace('{link}', link).replace('{date}', fmtDate(warranty(t, 0).end)) }

/** advance the demo clock and send every reminder whose milestone was crossed */
export function simulate(days: number): Reminder[] {
  const out: Reminder[] = []
  update(d => {
    const from = now(d), to = from + days * DAY
    d.offset += days * DAY
    for (const t of d.tables) {
      if (t.status !== 'active') continue
      for (const r of d.rules) {
        if (!r.on) continue
        const at = r.kind === 'warranty' ? t.installDate + (t.warrantyMonths - 1) * MONTH : t.installDate + r.months * MONTH
        if (at > from && at <= to) {
          const token = tok()
          const rem: Reminder = { id: 'r' + token, token, serial: t.serial, rule: r.name, sentAt: Math.min(to, at + DAY), msg: fillTpl(r.template, t, bookUrl(token)), status: 'sent' }
          d.reminders.unshift(rem); out.push(rem)
        }
      }
    }
  })
  return out
}
export function ensureBookingToken(serial: string) { const token = 'p-' + serial; return token }
export function addBooking(b: Omit<Booking, 'ref' | 'createdAt' | 'status'>) {
  let ref = ''
  update(d => { d.seq++; ref = 'SV-' + d.seq; d.bookings.unshift({ ...b, ref, createdAt: now(d), status: 'requested', fresh: true }); const r = d.reminders.find(x => x.token === b.token); if (r) r.status = 'booked' })
  return ref
}
export function completeBooking(ref: string) {
  update(d => {
    const b = d.bookings.find(x => x.ref === ref)!; b.status = 'done'; b.fresh = false
    const t = findTable(d, b.serial)!; const tech = d.techs.find(x => x.id === b.tech)
    t.history.push({ id: 'e' + ref, date: Math.max(now(d), b.slot), type: b.service as Ev['type'], title: svcName(b.service) + (b.cloth ? ' · ' + b.cloth : ''), note: `Booking ${ref}. Completed and signed off.`, by: tech?.name || 'EMRAD technician', price: b.price })
    if (b.service === 'recloth' && b.cloth) { const c = CLOTHS.find(c => c[0] === b.cloth); if (c) { t.cloth = c[0]; t.clothHex = c[1] } }
  })
}

/* ---------- fmt ---------- */
export const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-NG')
export const fmtDate = (t: number) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
export const fmtSlot = (t: number) => new Date(t).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
export const ago = (t: number, n: number) => { const d = Math.round((n - t) / DAY); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d < 60 ? d + ' days ago' : Math.round(d / 30.4) + ' months ago' }
