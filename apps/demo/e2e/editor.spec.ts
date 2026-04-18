import { expect, test } from '@playwright/test'

test.describe('Basic Editing', () => {
  test('editor renders and accepts input', async ({ page }) => {
    await page.goto('/')
    const editor = page.locator('#editor .ProseMirror')
    await expect(editor).toBeVisible()
    await editor.click()
    await editor.pressSequentially('Hello E2E')
    await expect(editor).toContainText('Hello E2E')
  })

  test('setContent and getHTML round-trip', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      const win = window as unknown as { editor: { setContent: (c: string) => void } }
      win.editor.setContent('<p>Delete</p>')
    })
    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).toContain('Delete')
  })

  test('Enter creates new paragraph', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      ;(window as unknown as { editor: { setContent: (c: string) => void } }).editor.setContent(
        '<p>First line</p>',
      )
    })
    const editor = page.locator('#editor .ProseMirror')
    await editor.click()
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await editor.pressSequentially('Second line')
    await expect(editor).toContainText('First line')
    await expect(editor).toContainText('Second line')
  })
})
