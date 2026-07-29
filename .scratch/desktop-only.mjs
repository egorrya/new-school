import { chromium } from 'playwright'

const shotDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/cdc1c2d0-350e-421b-aa29-ecbe577a88ef/scratchpad'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1000)

const trigger = page.getByRole('button', { name: /меню/i }).first()
await trigger.waitFor({ state: 'visible', timeout: 20000 })
await page.screenshot({ path: `${shotDir}/desktop-header-closed.png` })

await trigger.click({ timeout: 10000 })
await page.waitForTimeout(900)
await page.screenshot({ path: `${shotDir}/desktop-header-open.png` })

// verify header chrome (logo) is hidden while overlay is open, toggle still visible
const logoVisible = await page.locator('header a[aria-label="Новая школа"]').isVisible()
const ctaHeaderVisible = await page.locator('header').getByRole('link', { name: 'Оставить заявку' }).first().isVisible()

await page.mouse.click(20, 20)
await page.waitForTimeout(1200)
const menuCountAfterBackdrop = await page.locator('[role="menu"]').count()
await page.screenshot({ path: `${shotDir}/desktop-after-backdrop.png` })

console.log('logoVisibleWhileOpen (should be false):', logoVisible)
console.log('ctaHeaderVisibleWhileOpen (should be false, hidden w/ toggle-only):', ctaHeaderVisible)
console.log('menuCountAfterBackdropClick (should be 0):', menuCountAfterBackdrop)
console.log('consoleErrors:', errors)

await browser.close()
