import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1500)

const info = await page.evaluate(() => {
  const x = 1196
  const y = 82
  const el = document.elementFromPoint(x, y)
  return {
    tag: el?.tagName,
    cls: el?.className,
    ariaLabel: el?.getAttribute?.('aria-label'),
    rect: el?.getBoundingClientRect ? JSON.parse(JSON.stringify(el.getBoundingClientRect())) : null,
  }
})
console.log(JSON.stringify(info, null, 2))

try {
  await page.getByRole('button', { name: /меню/i }).first().click({ timeout: 5000 })
  console.log('CLICK OK')
} catch (e) {
  console.log('CLICK FAILED:', e.message.split('\n').slice(0, 6).join('\n'))
}

await browser.close()
