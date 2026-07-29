import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

async function tryScroll(label) {
  const result = await page.evaluate(() => {
    window.scrollTo(0, window.scrollY) // reset x
    window.scrollBy(500, 0)
    return {
      scrollX: window.scrollX,
      htmlOverflowX: getComputedStyle(document.documentElement).overflowX,
      bodyOverflowX: getComputedStyle(document.body).overflowX,
    }
  })
  console.log(label, JSON.stringify(result))
}

await tryScroll('top of page')

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(1000)
await tryScroll('scrolled to footer, then try horizontal')

await browser.close()
