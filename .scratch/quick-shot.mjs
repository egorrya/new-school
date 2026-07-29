import { chromium } from 'playwright'

const shotDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/cdc1c2d0-350e-421b-aa29-ecbe577a88ef/scratchpad'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1500)
await page.screenshot({ path: `${shotDir}/raw-state.png`, fullPage: false })
const overlayCount = await page.locator('nextjs-portal, [data-nextjs-dialog-overlay], #nextjs__container_errors_label').count()
console.log('overlayCount', overlayCount)
await browser.close()
