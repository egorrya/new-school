import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page: testPage }) => {
    await testPage.goto('http://localhost:3000')
    await expect(testPage).toHaveTitle(/Новая школа/)
    const heading = testPage.locator('h1').first()
    await expect(heading).toHaveText('Новая школа')
  })
})
