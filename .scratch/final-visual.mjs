import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(1400)
await page.screenshot({ path: `${outDir}/FINAL-grid.png` })

const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(1).hover()
await page.waitForTimeout(600)
await page.screenshot({ path: `${outDir}/FINAL-hover-spotlight.png` })

await cards.nth(1).click()
await page.waitForTimeout(700)
await page.screenshot({ path: `${outDir}/FINAL-modal.png` })

await page.setViewportSize({ width: 390, height: 844 })
await page.waitForTimeout(300)
await page.screenshot({ path: `${outDir}/FINAL-modal-mobile.png` })

await browser.close()
