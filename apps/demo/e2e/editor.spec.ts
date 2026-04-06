import { expect, test } from '@playwright/test'

test('editor renders and accepts input', async ({ page }) => {
  await page.goto('/')
  const editor = page.locator('#editor [contenteditable]')
  await expect(editor).toBeVisible()
  await editor.click()
  await editor.pressSequentially('Hello E2E')
  await expect(editor).toContainText('Hello E2E')
})

test('Ctrl+B toggles bold', async ({ page }) => {
  await page.goto('/')
  const editor = page.locator('#editor [contenteditable]')
  await editor.click()
  await editor.pressSequentially('test')
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Control+b')
  const strong = editor.locator('strong')
  await expect(strong).toContainText('test')
})
