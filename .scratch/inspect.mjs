import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.getByLabel('Открыть меню').click()
await page.waitForTimeout(700)

const info = await page.evaluate(() => {
  const btnWrap = document.querySelector('.mt-auto')
  const btn = btnWrap?.querySelector('button, a[data-slot="button"]') || btnWrap?.querySelector('[data-slot="button"]')
  const nav = document.querySelector('nav[aria-label="Мобильное меню"]')
  const panel = document.querySelector('[role="dialog"]')

  function describe(el, label) {
    if (!el) return { label, missing: true }
    const cs = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    return {
      label,
      tag: el.tagName,
      className: el.className,
      rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, height: rect.height },
      boxShadow: cs.boxShadow,
      border: cs.border,
      borderTop: cs.borderTop,
      outline: cs.outline,
      background: cs.backgroundColor,
      marginTop: cs.marginTop,
    }
  }

  return {
    btnWrap: describe(btnWrap, 'btnWrap(.mt-auto)'),
    btn: describe(btn, 'btn'),
    nav: describe(nav, 'nav'),
    panel: describe(panel, 'panel'),
  }
})

console.log(JSON.stringify(info, null, 2))

await page.screenshot({ path: '/private/tmp/claude-501/-Users-egorrya-Code-new-school/669fe4ae-af13-40a1-8aef-a3a4dc626a7c/scratchpad/inspect.png' })

await browser.close()
