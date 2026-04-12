import { expect, test } from '@playwright/test'

test.describe('Basic Editing', () => {
  test('editor renders and accepts input', async ({ page }) => {
    await page.goto('/')
    const editor = page.locator('#editor [contenteditable]')
    await expect(editor).toBeVisible()
    await editor.click()
    await editor.pressSequentially('Hello E2E')
    await expect(editor).toContainText('Hello E2E')
  })

  test('delete text with Backspace', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      ;(window as unknown as { editor: { setContent: (c: string) => void } }).editor.setContent(
        '<p></p>',
      )
    })
    const editor = page.locator('#editor [contenteditable]')
    await editor.click()
    await editor.pressSequentially('DeleteTest')
    // Delete 4 chars: "Test" -> leaves "Delete"
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Backspace')
    }
    await expect(editor).toContainText('Delete')
  })

  test('Enter creates new paragraph', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      ;(window as unknown as { editor: { setContent: (c: string) => void } }).editor.setContent(
        '<p>First line</p>',
      )
    })
    const editor = page.locator('#editor [contenteditable]')
    await editor.click()
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await editor.pressSequentially('Second line')
    await expect(editor).toContainText('First line')
    await expect(editor).toContainText('Second line')
  })
})
