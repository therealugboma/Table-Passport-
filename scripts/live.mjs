import { chromium } from 'playwright'
const B='http://127.0.0.1:4200/'
const br=await chromium.launch(); const c=await br.newContext({viewport:{width:1440,height:900}})
const a=await c.newPage(); await a.goto(B); await a.evaluate(()=>localStorage.clear()); await a.goto(B+'#/app/bookings'); await a.waitForTimeout(500)
const b=await c.newPage(); await b.goto(B+'#/b/p-EMR-SN-24-0117'); await b.locator('[data-testid=slot]:not([disabled])').first().click(); await b.click('[data-testid=confirm]'); await b.waitForSelector('[data-testid=confirmed]')
const ref=(await b.textContent('[data-testid=confirmed] .label.acc')).split('·')[1].trim()
await a.waitForSelector(`[data-testid=bk-${ref}]`,{timeout:5000}); await a.waitForSelector('.toast'); console.log('live update + toast ok', ref)
await a.screenshot({path:'screenshots/08b-bookings-live-toast.png'}); await br.close()
