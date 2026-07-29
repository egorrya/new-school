import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1000)

const getMainHeight = () => document.querySelector('main')?.getBoundingClientRect().height

const mainHeight = await page.evaluate(getMainHeight)
console.log('mainHeight', mainHeight)

for (const y of [0, 100, 400, 800]) {
  await page.evaluate((sy) => window.scrollTo(0, sy), y)
  await page.waitForTimeout(200)
  const rect = await page.evaluate(() => document.querySelector('.sticky')?.getBoundingClientRect())
  console.log('scrollY target', y, 'actual', await page.evaluate(() => window.scrollY), 'stickyRect', rect)
}

await browser.close()
