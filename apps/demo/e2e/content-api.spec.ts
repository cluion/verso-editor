import { expect, test } from '@playwright/test'

test.describe('Content API', () => {
  test('getHTML returns editor content', async ({ page }) => {
    await page.goto('/')
    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).toContain('Verso Editor')
    expect(html).toContain('<p>')
  })

  test('getJSON returns valid JSON structure', async ({ page }) => {
    await page.goto('/')
    const json = await page.evaluate(() => {
      return (
        window as unknown as { editor: { getJSON: () => Record<string, unknown> } }
      ).editor.getJSON()
    })
    expect(json.type).toBe('doc')
    expect(Array.isArray(json.content)).toBe(true)
  })

  test('setContent updates editor', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      ;(window as unknown as { editor: { setContent: (c: string) => void } }).editor.setContent(
        '<p>Dynamic content</p>',
      )
    })
    const editor = page.locator('#editor [contenteditable]').first()
    await expect(editor).toContainText('Dynamic content')
  })

  test('setContent + getHTML round-trip', async ({ page }) => {
    await page.goto('/')
    const input = '<p>Round trip test</p>'
    await page.evaluate((html) => {
      ;(window as unknown as { editor: { setContent: (c: string) => void } }).editor.setContent(
        html,
      )
    }, input)
    const output = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(output).toContain('Round trip test')
  })

  test('preview panel updates on edit', async ({ page }) => {
    await page.goto('/')
    const editor = page.locator('#editor [contenteditable]').first()
    await editor.click()
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await editor.pressSequentially('Preview test')

    // The HTML preview panel should contain the new text
    const htmlPanel = page.locator('#panel-html code')
    await expect(htmlPanel).toContainText('Preview test')
  })
})
