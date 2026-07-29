import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:3000/dev-preview-teachers', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.locator('button:has-text("Курт Хендерсон")').first().click()
await page.waitForTimeout(600)

const result = await page.evaluate(() => {
  const heading = [...document.querySelectorAll('h2')].find((h) => h.textContent?.includes('Курт'))
  let el = heading?.parentElement || null
  while (el) {
    const cs = getComputedStyle(el)
    if (cs.overflowY === 'auto' || cs.overflowY === 'scroll') break
    el = el.parentElement
  }
  if (!el) return { found: false }
  const before = el.scrollTop
  el.scrollBy(0, 500)
  const after = el.scrollTop
  return { found: true, before, after, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }
})
console.log(JSON.stringify(result, null, 2))

await page.screenshot({ path: `${outDir}/10-verified-scroll.png` })
await browser.close()
