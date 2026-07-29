import { chromium } from 'playwright'

const shotDir = '/private/tmp/claude-501/-Users-egorrya-Code-new-school/cdc1c2d0-350e-421b-aa29-ecbe577a88ef/scratchpad'

const browser = await chromium.launch()

async function run(viewport, label) {
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))

  await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 45000 })

  const trigger = page.getByRole('button', { name: /меню/i }).first()
  await trigger.waitFor({ state: 'visible', timeout: 20000 })

  await trigger.click()
  await page.waitForTimeout(900) // let stagger/pop animation settle

  await page.screenshot({ path: `${shotDir}/menu-open-${label}.png` })

  // click on empty backdrop area (top-left corner, away from pills) to test overlay-close
  await page.mouse.click(10, 10)
  await page.waitForTimeout(1200)
  const isOpenAfterBackdrop = await page.locator('[role="menu"]').count()
  await page.screenshot({ path: `${shotDir}/menu-after-backdrop-click-${label}.png` })

  // reopen and close with the toggle button
  await trigger.click()
  await page.waitForTimeout(900)
  await trigger.click()
  await page.waitForTimeout(1200)
  const isOpenAfterButton = await page.locator('[role="menu"]').count()
  await page.screenshot({ path: `${shotDir}/menu-after-button-close-${label}.png` })

  console.log(
    label,
    'backdropClosed:',
    isOpenAfterBackdrop === 0,
    'buttonClosed:',
    isOpenAfterButton === 0,
    'consoleErrors:',
    errors.filter((e) => !e.includes('webpack-hmr')),
  )

  await page.close()
}

await run({ width: 390, height: 844 }, 'mobile')
await run({ width: 1280, height: 900 }, 'desktop')

await browser.close()
