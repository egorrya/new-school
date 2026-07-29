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
await page.screenshot({ path: `${outDir}/final-01-grid-default-colored.png` })

// Hover the middle card (Ольга), others should go grayscale
const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(1).hover()
await page.waitForTimeout(600)
await page.screenshot({ path: `${outDir}/final-02-spotlight-hover.png` })

const filters = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('.teacher-photo')]
  return imgs.map((img) => getComputedStyle(img).filter)
})
console.log('FILTERS_WHILE_HOVERING_CARD_1:', JSON.stringify(filters))

// Open modal, click overlay to close
await cards.nth(1).click()
await page.waitForTimeout(700)
await page.screenshot({ path: `${outDir}/final-03-modal-white-overlay.png` })

const overlayBg = await page.evaluate(() => {
  const overlay = document.querySelector('[data-radix-popper-content-wrapper], .fixed.inset-0.z-60')
  const all = [...document.querySelectorAll('.fixed.inset-0')]
  return all.map((el) => getComputedStyle(el).backgroundColor)
})
console.log('OVERLAY_BACKGROUNDS:', JSON.stringify(overlayBg))

// click far corner (overlay area, not panel) to close
await page.mouse.click(50, 50)
await page.waitForTimeout(500)
const dialogCount = await page.locator('[role="dialog"]').count()
console.log('DIALOG_COUNT_AFTER_OVERLAY_CLICK:', dialogCount)
await page.screenshot({ path: `${outDir}/final-04-closed-after-overlay-click.png` })

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
