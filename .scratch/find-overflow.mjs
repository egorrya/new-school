import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

async function report(label) {
  const info = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth
    const results = []
    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.right > docWidth + 1 || rect.left < -1) {
        results.push({
          tag: el.tagName,
          className: typeof el.className === 'string' ? el.className.slice(0, 140) : '',
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        })
      }
    })
    return {
      docWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      offenders: results.slice(0, 25),
    }
  })
  console.log('---', label, '---')
  console.log(JSON.stringify(info, null, 2))
}

await report('top of page')

// scroll to bottom to mount/reveal footer
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(1200)
await report('scrolled to footer')

await page.screenshot({ path: '/private/tmp/claude-501/-Users-egorrya-Code-new-school/f3240703-1aad-47c3-abfd-1bd24b74c3a7/scratchpad/footer-mobile.png', fullPage: false })

await browser.close()
