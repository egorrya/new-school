import { chromium } from 'playwright'

const shotDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/cdc1c2d0-350e-421b-aa29-ecbe577a88ef/scratchpad'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
page.on('console', (msg) => console.log('CONSOLE', msg.type(), msg.text()))
page.on('pageerror', (err) => console.log('PAGEERROR', String(err)))
await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(2000)

const html = await page.locator('header').first().innerHTML().catch((e) => 'ERR:' + e.message)
console.log('HEADER_HTML_LEN', html.length)
console.log(html.slice(0, 3000))

await page.screenshot({ path: `${shotDir}/console-check.png` })
await browser.close()
