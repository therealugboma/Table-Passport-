# Table Passport by VUG — clickable demo (EMRAD × VUG)

Every EMRAD snooker/pool table gets a QR plate. Scanning it opens the table's passport: maker, materials, craftsmen, warranty, service and ownership history. WhatsApp reminders link to a pre-filled one-tap booking page.

## Run
```
npm install          # node_modules already present if copied from Enquivo
npm run dev          # http://localhost:4200
npm run build && npx vite preview --port 4200 --host 127.0.0.1
node scripts/verify.mjs   # Playwright end-to-end flow + screenshots (needs preview running)
node scripts/live.mjs     # two tabs: booking appears live in the dashboard (storage event) + toast
```
Vite + React + TypeScript, hash routing (`/#/p/...`). `index.html` maps plain paths (`/p/EMR-SN-24-0117`) to hash routes; `vercel.json` has an SPA rewrite.

## Routes
| Route | What |
|---|---|
| `/` | Landing: pitch, how it works, benefits, example pricing, demo links |
| `/p/EMR-SN-24-0117` | Owner passport (mobile-first): authenticity badge, art + swatches, next care, warranty, specs, craftsmen, timeline, owners; Book / Report issue (photo preview) / Transfer / Share for resale / WhatsApp |
| `/r/<serial>` | Public resale view (owner data hidden) |
| `/b/<token>` | One-tap booking from a reminder link (`/b/p-<serial>` from the passport) |
| `/verify`, `/verify/<serial>` | Authenticity: Genuine / Not found (logged as alert) / Reported stolen |
| `/install` | Installer app: sticker → order → spec → photos → levels → owner + consent → signature → activate + WhatsApp welcome preview |
| `/s/<stickerId>` | What a QR sticker encodes; resolves to the passport once activated |
| `/app` … | EMRAD dashboard: Overview, Tables registry (+detail), Reminders (rules, queue, **Simulate +6 months**, WhatsApp preview), Bookings (list/calendar, assign, mark done), Technicians, QR stickers (generate batch), Transfers & resale, Authenticity alerts, Settings (templates, ₦ prices, branding) |
| `/print/stickers?batch=…`, `/print/plate/<serial>` | Printable A4 label sheet (3×8) and engraved plate mock |

## Data
All in `localStorage` (`tpassport.v1.db`), seeded with 24 fictional tables, 3 open install orders, 4 technicians, bookings, reminders, alerts. Tabs sync via `storage` events. **Reset demo data** in the dashboard sidebar or the landing page footer. The demo clock (`offset`) moves forward with the time machine.

## How to present (≈10 min) — or press "Demo tour" (11 steps with Say lines)
1. Landing → one line pitch. 2. `/install` in a phone-size window: sticker **TP-001231**, order **ORD-1042**, sample photo, owner, sign, Register. 3. Open the passport. 4. Dashboard → Reminders → **Simulate time: +6 months**. 5. WhatsApp preview → click the link. 6. Book a re-cloth, pick a slot, confirm. 7. Bookings (keep it open in another window: it appears live with a toast) → assign → Mark done. 8. Passport timeline updated. 9. `/verify`: EMR-SN-24-0117 genuine, FAKE-1234 not found, stolen example; Alerts shows the scan. 10. Resale view + transfer.

## Mocked
No backend, no real WhatsApp sending (messages are previews; wa.me links open WhatsApp), camera QR scanning simulated (manual entry / tap), photo upload is a local preview only, pricing and revenue numbers illustrative, no auth/roles. QR codes are generated locally with `qrcode` and point at this demo's own URL.
