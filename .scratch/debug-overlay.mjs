import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(900)

const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(1).click()
await page.waitForTimeout(700)

const panelBox = await page.locator('[role="dialog"]').boundingBox()
console.log('PANEL_BOX:', JSON.stringify(panelBox))

const elInfo = await page.evaluate(() => {
  const el = document.elementFromPoint(200, 900)
  return el ? { tag: el.tagName, className: el.className, id: el.id } : null
})
console.log('ELEMENT_AT_200_900:', JSON.stringify(elInfo))

// inspect the fixed inset-0 wrapper for onclick presence indirectly by dispatching a real click and listening
const clicked = await page.evaluate(() => {
  const wrappers = [...document.querySelectorAll('.fixed.inset-0')]
  return wrappers.map((w) => ({
    className: w.className,
    zIndex: getComputedStyle(w).zIndex,
    pointerEvents: getComputedStyle(w).pointerEvents,
  }))
})
console.log('WRAPPERS:', JSON.stringify(clicked, null, 2))

await browser.close()
