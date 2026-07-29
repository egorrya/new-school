import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(1400) // allow staggered entrance (index*300ms) to finish
await page.screenshot({ path: `${outDir}/v-01-grid-colored-wrapped.png` })

// equal row height check
const heights = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('button.teacher-card')]
  return cards.map((c) => Math.round(c.getBoundingClientRect().height))
})
console.log('CARD_HEIGHTS:', JSON.stringify(heights))

// overlay click-to-close
const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(0).click()
await page.waitForTimeout(700)
await page.screenshot({ path: `${outDir}/v-02-modal-open.png` })
await page.mouse.click(100, 900)
await page.waitForTimeout(600)
console.log('DIALOG_COUNT_AFTER_OVERLAY_CLICK:', await page.locator('[role="dialog"]').count())

// once:false re-trigger: scroll away then back, card should re-fade-in
await page.mouse.wheel(0, 3000)
await page.waitForTimeout(500)
await page.mouse.wheel(0, -3000)
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
const opacityRightAfterScrollBack = await cards.nth(0).evaluate((el) => getComputedStyle(el).opacity)
console.log('OPACITY_IMMEDIATELY_AFTER_SCROLL_BACK (should be <1 if re-animating):', opacityRightAfterScrollBack)
await page.waitForTimeout(900)
const opacitySettled = await cards.nth(0).evaluate((el) => getComputedStyle(el).opacity)
console.log('OPACITY_SETTLED:', opacitySettled)

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
