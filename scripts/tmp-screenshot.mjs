import { chromium } from 'playwright-core'
import { execSync } from 'node:child_process'

const executablePath = execSync('find /Applications -maxdepth 4 -iname "Google Chrome.app" -print -quit 2>/dev/null').toString().trim()

const browser = await chromium.launch({
  executablePath: executablePath ? `${executablePath}/Contents/MacOS/Google Chrome` : undefined,
  args: ['--no-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto('http://localhost:3000/school', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Педагоги Новой школы', { timeout: 15000 })

const el = await page.$('text=Педагоги Новой школы')
await el.scrollIntoViewIfNeeded()
await page.waitForTimeout(1500)

await page.screenshot({ path: '/private/tmp/claude-501/-Users-egorrya-Code-new-school/f0650c08-22e8-416a-b49f-4a799574967f/scratchpad/teacher-spotlight-a.png' })
await page.waitForTimeout(2500)
await page.screenshot({ path: '/private/tmp/claude-501/-Users-egorrya-Code-new-school/f0650c08-22e8-416a-b49f-4a799574967f/scratchpad/teacher-spotlight-b.png' })

const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } })
await mobilePage.goto('http://localhost:3000/school', { waitUntil: 'networkidle' })
await mobilePage.waitForSelector('text=Педагоги Новой школы', { timeout: 15000 })
const mobileEl = await mobilePage.$('text=Педагоги Новой школы')
await mobileEl.scrollIntoViewIfNeeded()
await mobilePage.mouse.wheel(0, 700)
await mobilePage.waitForTimeout(1200)
await mobilePage.screenshot({ path: '/private/tmp/claude-501/-Users-egorrya-Code-new-school/f0650c08-22e8-416a-b49f-4a799574967f/scratchpad/teacher-spotlight-mobile.png' })

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))

await browser.close()
