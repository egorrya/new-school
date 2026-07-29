import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1000)
await page.evaluate(() => window.scrollTo(0, 400))
await page.waitForTimeout(300)

const trigger = page.getByRole('button', { name: /меню/i }).first()
await trigger.waitFor({ state: 'visible', timeout: 20000 })
await trigger.click({ timeout: 10000 })
await page.waitForTimeout(900)

const scrollYBeforeWheel = await page.evaluate(() => window.scrollY)
await page.mouse.move(640, 450)
await page.mouse.wheel(0, 600)
await page.waitForTimeout(300)
const scrollYAfterWheel = await page.evaluate(() => window.scrollY)

console.log('scrollY before wheel (dialog open):', scrollYBeforeWheel)
console.log('scrollY after wheel attempt (dialog open):', scrollYAfterWheel)
console.log('background scroll blocked:', scrollYBeforeWheel === scrollYAfterWheel)

await browser.close()
