import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto('http://localhost:3000/dev-preview-teachers', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

const card = page.locator('button:has-text("Курт Хендерсон")').first()
await card.click()
await page.waitForTimeout(600)
await page.screenshot({ path: `${outDir}/07-modal-long-desc.png` })

// scroll within the text panel to confirm internal scroll works, image stays put
const panel = page.locator('[role="dialog"] >> text=Абзац 1').first()
await panel.evaluate((el) => {
  const scrollContainer = el.closest('.overflow-y-auto') || el.parentElement
  scrollContainer?.scrollBy(0, 400)
})
await page.waitForTimeout(300)
await page.screenshot({ path: `${outDir}/08-modal-long-desc-scrolled.png` })

// mobile modal
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://localhost:3000/dev-preview-teachers', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.locator('button:has-text("Курт Хендерсон")').first().click()
await page.waitForTimeout(600)
await page.screenshot({ path: `${outDir}/09-modal-mobile.png`, fullPage: true })

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
