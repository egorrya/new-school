import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('console', (msg) => console.log('C:', msg.text()))

await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(1400)

await page.evaluate(() => {
  document.addEventListener('click', (e) => {
    console.log('DOC CLICK target=', e.target.tagName, (e.target.className || '').toString().slice(0, 60), 'x=', e.clientX, 'y=', e.clientY)
  }, true)
})

const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(0).click()
await page.waitForTimeout(700)
console.log('dialogs before:', await page.locator('[role="dialog"]').count())

const elAtPoint = await page.evaluate(() => {
  const el = document.elementFromPoint(1400, 500)
  return el ? { tag: el.tagName, cls: (el.className||'').toString().slice(0,80) } : null
})
console.log('element at (1400,500):', JSON.stringify(elAtPoint))

await page.mouse.click(1400, 500)
await page.waitForTimeout(700)
console.log('dialogs after:', await page.locator('[role="dialog"]').count())

await browser.close()
