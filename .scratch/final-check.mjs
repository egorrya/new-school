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
await trigger.click({ timeout: 10000 })
await page.waitForTimeout(900)
await page.screenshot({ path: `${shotDir}/final-open.png` })

// hover the first pill to check the marquee-sourced accent color
const firstPill = page.locator('[role="menu"] a').first()
await firstPill.hover()
await page.waitForTimeout(300)
await page.screenshot({ path: `${shotDir}/final-hover.png` })

// close via backdrop click
await page.mouse.click(20, 20)
await page.waitForTimeout(800)
const menuCount = await page.locator('[role="menu"]').count()
console.log('menuCount after backdrop close:', menuCount)
console.log('consoleErrors:', errors)

await browser.close()
