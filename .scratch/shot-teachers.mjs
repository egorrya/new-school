import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto('http://localhost:3000/dev-preview-teachers', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Наши преподаватели')
await page.waitForTimeout(800) // let whileInView animations settle

await page.screenshot({ path: `${outDir}/01-grid-desktop.png`, fullPage: true })

// Hover 3rd card (Рональд Ричардс)
const card = page.locator('button:has-text("Рональд Ричардс")').first()
await card.hover()
await page.waitForTimeout(600)
await page.screenshot({ path: `${outDir}/02-grid-hover-3rd.png`, fullPage: false })

// Click to open modal
await card.click()
await page.waitForTimeout(600)
await page.screenshot({ path: `${outDir}/03-modal-open.png`, fullPage: false })
await page.keyboard.press('Escape')
await page.waitForTimeout(400)

// Mobile viewport
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://localhost:3000/dev-preview-teachers', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({ path: `${outDir}/04-grid-mobile.png`, fullPage: true })

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))

await browser.close()
