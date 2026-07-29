import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

const info = await page.evaluate(() => {
  document.documentElement.style.overflowX = 'visible'
  document.body.style.overflowX = 'visible'

  const docWidth = document.documentElement.clientWidth

  // Find the MediaFrame element specifically (aspect-[4/3] min-h-[20rem])
  const target = Array.from(document.querySelectorAll('div')).find((el) =>
    el.className.includes && el.className.includes('aspect-[4/3]') && el.className.includes('min-h-[20rem]'),
  )

  const chain = []
  let node = target
  while (node) {
    const rect = node.getBoundingClientRect()
    const cs = getComputedStyle(node)
    chain.push({
      tag: node.tagName,
      className: typeof node.className === 'string' ? node.className.slice(0, 160) : String(node.className),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      width: Math.round(rect.width),
      display: cs.display,
      overflowX: cs.overflowX,
      minWidth: cs.minWidth,
    })
    node = node.parentElement
  }

  return { docWidth, chain }
})

console.log(JSON.stringify(info, null, 2))

await browser.close()
