import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

async function report(label) {
  const info = await page.evaluate(() => {
    // Temporarily lift the html/body overflow-x safety net so we can see the
    // real, unmasked overflow the way iOS Safari's rubber-band scroll would.
    const prevHtmlOverflow = document.documentElement.style.overflowX
    const prevBodyOverflow = document.body.style.overflowX
    document.documentElement.style.overflowX = 'visible'
    document.body.style.overflowX = 'visible'

    const docWidth = document.documentElement.clientWidth

    function isClipped(el) {
      let node = el.parentElement
      while (node && node !== document.body.parentElement) {
        const cs = getComputedStyle(node)
        const ox = cs.overflowX
        if ((ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll')) {
          const rect = node.getBoundingClientRect()
          // Only counts as "clipping" if this ancestor itself is not also
          // blowing past the viewport by roughly the same overflow.
          if (rect.right <= docWidth + 1 && rect.left >= -1) {
            return { clippedBy: node.tagName, className: String(node.className).slice(0, 100) }
          }
        }
        node = node.parentElement
      }
      return null
    }

    const results = []
    document.querySelectorAll('body *').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return
      if (rect.right > docWidth + 1 || rect.left < -1) {
        const clip = isClipped(el)
        if (!clip) {
          results.push({
            tag: el.tagName,
            id: el.id,
            className: typeof el.className === 'string' ? el.className.slice(0, 160) : '',
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          })
        }
      }
    })

    const trueScrollWidth = document.documentElement.scrollWidth
    const trueBodyScrollWidth = document.body.scrollWidth

    document.documentElement.style.overflowX = prevHtmlOverflow
    document.body.style.overflowX = prevBodyOverflow

    return { docWidth, trueScrollWidth, trueBodyScrollWidth, offenders: results.slice(0, 30) }
  })
  console.log('---', label, '---')
  console.log(JSON.stringify(info, null, 2))
}

await report('top of page (safety-net lifted)')

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(1200)
await report('scrolled to footer (safety-net lifted)')

await browser.close()
