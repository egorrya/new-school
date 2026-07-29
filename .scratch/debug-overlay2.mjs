import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('console', (msg) => console.log('BROWSER_CONSOLE:', msg.type(), msg.text()))
page.on('pageerror', (err) => console.log('PAGE_ERROR:', String(err)))

await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' })
await page.locator('text=Преподаватели').first().scrollIntoViewIfNeeded()
await page.waitForTimeout(900)

const cards = page.locator('section:has-text("Преподаватели") button.teacher-card')
await cards.nth(1).click()
await page.waitForTimeout(700)

// inject a capture-phase listener to see if click event even arrives / is stopped
await page.evaluate(() => {
  document.addEventListener('click', (e) => {
    console.log('CAPTURE CLICK on', e.target.tagName, e.target.className, 'defaultPrevented=', e.defaultPrevented)
  }, true)
})

console.log('dialogs before:', await page.locator('[role="dialog"]').count())
await page.mouse.click(200, 900)
await page.waitForTimeout(600)
console.log('dialogs after:', await page.locator('[role="dialog"]').count())

await browser.close()
