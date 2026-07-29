import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('http://localhost:3000/dev-preview-teachers', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

const card = page.locator('button:has-text("Рональд Ричардс")').first()
const img = card.locator('img').first()

const before = await img.evaluate((el) => ({
  className: el.className,
  filter: getComputedStyle(el).filter,
}))
console.log('BEFORE HOVER', before)

await card.hover()
await page.waitForTimeout(700)

const after = await img.evaluate((el) => ({
  className: el.className,
  filter: getComputedStyle(el).filter,
}))
console.log('AFTER HOVER', after)

await browser.close()
