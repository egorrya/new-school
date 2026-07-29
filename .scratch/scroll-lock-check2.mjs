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

const info = await page.evaluate(() => {
  const body = document.body
  const html = document.documentElement
  const bodyCS = getComputedStyle(body)
  const htmlCS = getComputedStyle(html)

  const styleTags = [...document.querySelectorAll('style')]
    .map((s) => s.textContent || '')
    .filter((t) => t.includes('scroll-locked') || t.includes('data-scroll-locked'))

  // find the InfiniteGridBackground sticky element
  const stickyEl = document.querySelector('.sticky')
  const stickyCS = stickyEl ? getComputedStyle(stickyEl) : null
  const stickyRect = stickyEl ? stickyEl.getBoundingClientRect() : null

  return {
    scrollingElementTag: document.scrollingElement?.tagName,
    bodyOverflow: bodyCS.overflow,
    bodyPosition: bodyCS.position,
    bodyHeight: bodyCS.height,
    htmlOverflow: htmlCS.overflow,
    htmlPosition: htmlCS.position,
    scrollY: window.scrollY,
    injectedStyleSnippets: styleTags,
    stickyElFound: Boolean(stickyEl),
    stickyPosition: stickyCS?.position,
    stickyTop: stickyCS?.top,
    stickyRect,
  }
})
console.log(JSON.stringify(info, null, 2))

await browser.close()
