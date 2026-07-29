import { chromium } from 'playwright'

const outDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/92bfaf29-2290-4a16-bef3-13c87f40a0e3/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:3000/dev-preview-teachers', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)

// Scroll down in real increments so IntersectionObserver actually fires, like a real user would.
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel(0, 500)
  await page.waitForTimeout(250)
}
await page.waitForTimeout(500)

const cardCount = await page.locator('button').filter({ hasText: 'Хендерсон' }).or(
  page.locator('button')
).count()

const opacities = await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('button.group')]
  return buttons.map((b) => ({
    name: b.querySelector('span > span')?.textContent,
    opacity: getComputedStyle(b).opacity,
    height: b.getBoundingClientRect().height,
  }))
})
console.log(JSON.stringify(opacities, null, 2))

await page.screenshot({ path: `${outDir}/11-mobile-after-real-scroll.png`, fullPage: true })
await browser.close()
