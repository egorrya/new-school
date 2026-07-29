import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:3000/dev-preview-teachers', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.locator('button:has-text("Джейн Купер")').first().click()
await page.waitForTimeout(600)
await page.screenshot({ path: `${outDir}/12-mobile-modal-top.png` })
await browser.close()
