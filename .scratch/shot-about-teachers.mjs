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
await page.screenshot({ path: `${outDir}/13-about-teachers-section.png` })

const cards = page.locator('section:has-text("Преподаватели") button.group')
const count = await cards.count()
console.log('teacher card count on /about:', count)

if (count >= 3) {
  await cards.nth(2).hover()
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${outDir}/14-about-teachers-hover.png` })

  await cards.nth(2).click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${outDir}/15-about-teachers-modal.png` })
}

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
