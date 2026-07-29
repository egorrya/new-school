import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(1400)

const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(0).click()
await page.waitForTimeout(700)
console.log('dialogs before:', await page.locator('[role="dialog"]').count())

// far right edge, vertically centered - safely outside the max-w-3xl panel and away from bottom-left widgets
await page.mouse.click(1400, 500)
await page.waitForTimeout(600)
console.log('dialogs after click at (1400,500):', await page.locator('[role="dialog"]').count())

await browser.close()
