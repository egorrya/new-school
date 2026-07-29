import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1000)
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(300)

const heightAt = async (y) => {
  await page.evaluate((sy) => window.scrollTo(0, sy), y)
  await page.waitForTimeout(120)
  return page.evaluate(() => {
    const el = document.querySelector('header a[aria-label]')?.parentElement
    return el ? el.getBoundingClientRect().height : null
  })
}

for (const y of [0, 20, 40, 60, 80, 100, 120, 140, 160, 200]) {
  const h = await heightAt(y)
  console.log('scrollY', y, 'logoHeight', h)
}

// also test rapid single big jump (fast flick) still lands correctly
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(300)
await page.evaluate(() => window.scrollTo(0, 500))
await page.waitForTimeout(100)
const fastJumpHeight = await page.evaluate(() => {
  const el = document.querySelector('header a[aria-label]')?.parentElement
  return el ? el.getBoundingClientRect().height : null
})
console.log('after fast jump to 500, height settles immediately to:', fastJumpHeight)

await browser.close()
