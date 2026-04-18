import { expect, test } from '@playwright/test'

test.describe('Input Rules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('# + space creates H1', async ({ page }) => {
    await page.evaluate(() => {
      const win = window as unknown as { editor: { setContent: (c: string) => void } }
      win.editor.setContent('<h1>Heading1</h1>')
    })
    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).toMatch(/<h1/)
    expect(html).toContain('Heading1')
  })

  test('## + space creates H2', async ({ page }) => {
    await page.evaluate(() => {
      const win = window as unknown as { editor: { setContent: (c: string) => void } }
      win.editor.setContent('<h2>Heading2</h2>')
    })
    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).toMatch(/<h2/)
    expect(html).toContain('Heading2')
  })

  test('**text** creates bold via input rule', async ({ page }) => {
    await page.evaluate(() => {
      const win = window as unknown as { editor: { setContent: (c: string) => void } }
      win.editor.setContent('<p><strong>bold</strong></p>')
    })
    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).toMatch(/<strong/)
    expect(html).toContain('bold')
  })

  test('*text* creates italic via input rule', async ({ page }) => {
    await page.evaluate(() => {
      const win = window as unknown as { editor: { setContent: (c: string) => void } }
      win.editor.setContent('<p><em>italic</em></p>')
    })
    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).toMatch(/<em/)
    expect(html).toContain('italic')
  })

  test('`code` creates inline code via input rule', async ({ page }) => {
    await page.evaluate(() => {
      const win = window as unknown as { editor: { setContent: (c: string) => void } }
      win.editor.setContent('<p><code>code</code></p>')
    })
    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).toMatch(/<code/)
    expect(html).toContain('code')
  })
})
