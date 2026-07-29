import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
await page.screenshot({ path: `${outDir}/real-teachers-grid.png` })

const names = await page.locator('section:has-text("Преподаватели") button.group span.font-heading').allInnerTexts()
console.log('NAMES:', JSON.stringify(names))

const first = page.locator('section:has-text("Преподаватели") button.group').first()
await first.click()
await page.waitForTimeout(700)
await page.screenshot({ path: `${outDir}/real-teacher-modal.png` })
const dialogText = await page.locator('[role="dialog"]').innerText()
console.log('DIALOG_TEXT:', JSON.stringify(dialogText))

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
