import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(900)

const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(1).click()
await page.waitForTimeout(700)

let dialogCount = await page.locator('[role="dialog"]').count()
console.log('DIALOG_COUNT_BEFORE:', dialogCount)

// Click well below/beside the panel, clearly overlay area, away from header.
await page.mouse.click(200, 900)
await page.waitForTimeout(500)
dialogCount = await page.locator('[role="dialog"]').count()
console.log('DIALOG_COUNT_AFTER_OVERLAY_CLICK_BELOW:', dialogCount)
await page.screenshot({ path: `${outDir}/final-05-closed-via-overlay.png` })

await browser.close()
