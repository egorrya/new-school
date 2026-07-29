import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('console', (msg) => console.log('C:', msg.text()))

await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(1400)

const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(0).click()
await page.waitForTimeout(1200)
console.log('dialogs before:', await page.locator('[role="dialog"]').count())

await page.mouse.click(1400, 500)
await page.waitForTimeout(1200)
console.log('dialogs after (try1):', await page.locator('[role="dialog"]').count())

// try again in case first click was swallowed
if (await page.locator('[role="dialog"]').count() > 0) {
  await page.mouse.click(1400, 500)
  await page.waitForTimeout(1200)
  console.log('dialogs after (try2):', await page.locator('[role="dialog"]').count())
}

await browser.close()
