import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1000)

// make sure we start at the very top (expanded state)
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(300)

const before = await page.evaluate(() => {
  const el = document.querySelector('header a[aria-label]')?.parentElement
  return el ? el.getBoundingClientRect().height : null
})
console.log('logo height at scrollY=0:', before)

// jump scroll past the compact threshold (48px) in one go, like a real flick
await page.evaluate(() => window.scrollTo(0, 300))

const samples = []
const t0 = Date.now()
while (Date.now() - t0 < 900) {
  const h = await page.evaluate(() => {
    const el = document.querySelector('header a[aria-label]')?.parentElement
    return el ? el.getBoundingClientRect().height : null
  })
  samples.push({ t: Date.now() - t0, h })
  await page.waitForTimeout(40)
}

console.log(JSON.stringify(samples, null, 2))

await browser.close()
