import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1500)

const html = await page.locator('header').first().innerHTML()
const idx = html.indexOf('Открыть')
console.log('idx of Открыть:', idx)
console.log(html.slice(Math.max(0, idx - 800), idx + 800))

const btn = page.getByRole('button', { name: /меню/i })
console.log('button count:', await btn.count())
if (await btn.count()) {
  const box = await btn.first().boundingBox()
  console.log('box', box)
  console.log('visible', await btn.first().isVisible())
}

await browser.close()
