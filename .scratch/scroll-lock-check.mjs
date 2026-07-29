import { chromium } from 'playwright'

const shotDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/cdc1c2d0-350e-421b-aa29-ecbe577a88ef/scratchpad'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1000)

// scroll down a bit so we're not at scrollY=0 (more realistic repro)
await page.evaluate(() => window.scrollTo(0, 400))
await page.waitForTimeout(300)

const before = await page.evaluate(() => ({
  scrollY: window.scrollY,
  bodyStyle: document.body.getAttribute('style'),
  htmlStyle: document.documentElement.getAttribute('style'),
  bodyAttrs: [...document.body.attributes].map((a) => `${a.name}=${a.value}`),
  htmlAttrs: [...document.documentElement.attributes].map((a) => `${a.name}=${a.value}`),
}))
console.log('BEFORE', JSON.stringify(before, null, 2))
await page.screenshot({ path: `${shotDir}/scroll-lock-before.png` })

const trigger = page.getByRole('button', { name: /меню/i }).first()
await trigger.waitFor({ state: 'visible', timeout: 20000 })
await trigger.click({ timeout: 10000 })
await page.waitForTimeout(900)

const after = await page.evaluate(() => ({
  scrollY: window.scrollY,
  bodyStyle: document.body.getAttribute('style'),
  htmlStyle: document.documentElement.getAttribute('style'),
  bodyAttrs: [...document.body.attributes].map((a) => `${a.name}=${a.value}`),
  htmlAttrs: [...document.documentElement.attributes].map((a) => `${a.name}=${a.value}`),
}))
console.log('AFTER', JSON.stringify(after, null, 2))
await page.screenshot({ path: `${shotDir}/scroll-lock-after.png` })

await browser.close()
