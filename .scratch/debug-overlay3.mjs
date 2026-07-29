import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('console', (msg) => console.log('C:', msg.text()))

await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(900)

const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(1).click()
await page.waitForTimeout(700)

await page.mouse.click(200, 900)
await page.waitForTimeout(1500)

const cardVisibility = await cards.nth(1).evaluate((el) => getComputedStyle(el).visibility)
console.log('CARD1_VISIBILITY_AFTER_OVERLAY_CLICK:', cardVisibility)

const dialogHTML = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]')
  return d ? d.outerHTML.slice(0, 300) : 'NO_DIALOG'
})
console.log('DIALOG_HTML_SNIPPET:', dialogHTML)

await browser.close()
