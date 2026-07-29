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

const card = page.locator('section:has-text("Преподаватели") button.group').nth(1)
await page.screenshot({ path: `${outDir}/m0-before-click.png` })

await card.click()
await page.waitForTimeout(120)
await page.screenshot({ path: `${outDir}/m1-mid-open-120ms.png` })
await page.waitForTimeout(150)
await page.screenshot({ path: `${outDir}/m2-mid-open-270ms.png` })
await page.waitForTimeout(500)
await page.screenshot({ path: `${outDir}/m3-open-settled.png` })

// check badge is gone
const bodyText = await page.locator('[role="dialog"]').innerText()
console.log('DIALOG_TEXT:', JSON.stringify(bodyText))

// close and watch morph back
await page.keyboard.press('Escape')
await page.waitForTimeout(120)
await page.screenshot({ path: `${outDir}/m4-mid-close-120ms.png` })
await page.waitForTimeout(500)
await page.screenshot({ path: `${outDir}/m5-closed-settled.png` })

// confirm the original card is visible again (not stuck hidden)
const visibility = await card.evaluate((el) => getComputedStyle(el).visibility)
console.log('CARD_VISIBILITY_AFTER_CLOSE:', visibility)

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
