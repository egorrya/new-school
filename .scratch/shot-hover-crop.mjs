import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('http://localhost:3000/dev-preview-teachers', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

const card = page.locator('button:has-text("Рональд Ричардс")').first()
const box = await card.boundingBox()

await page.screenshot({ path: `${outDir}/05-card3-before.png`, clip: box })

await card.hover()
await page.waitForTimeout(700)
await page.screenshot({ path: `${outDir}/06-card3-after.png`, clip: box })

await browser.close()
