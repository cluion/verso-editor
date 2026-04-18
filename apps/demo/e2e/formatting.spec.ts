import { expect, test } from '@playwright/test'

test.describe('Formatting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      ;(window as unknown as { editor: { setContent: (c: string) => void } }).editor.setContent(
        '<p>test text</p>',
      )
    })
  })

  async function selectAll(page: import('@playwright/test').Page) {
    // Use platform-aware select all
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control'
    await page.keyboard.press(`${modifier}+a`)
  }

  test('keyboard shortcut toggles bold', async ({ page }) => {
    const editor = page.locator('#editor .ProseMirror')
    await editor.click()
    await selectAll(page)
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control'
    await page.keyboard.press(`${modifier}+b`)
    const strong = editor.locator('strong')
    await expect(strong).toContainText('test text')
  })

  test('keyboard shortcut toggles italic', async ({ page }) => {
    const editor = page.locator('#editor .ProseMirror')
    await editor.click()
    await selectAll(page)
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control'
    await page.keyboard.press(`${modifier}+i`)
    const em = editor.locator('em')
    await expect(em).toContainText('test text')
  })

  test('toolbar bold button works', async ({ page }) => {
    const editor = page.locator('#editor .ProseMirror')
    await editor.click()
    await selectAll(page)
    const boldBtn = page.locator('#toolbar button[data-command="bold"]')
    await boldBtn.click()
    const strong = editor.locator('strong')
    await expect(strong).toContainText('test text')
  })

  test('toolbar italic button works', async ({ page }) => {
    const editor = page.locator('#editor .ProseMirror')
    await editor.click()
    await selectAll(page)
    const italicBtn = page.locator('#toolbar button[data-command="italic"]')
    await italicBtn.click()
    const em = editor.locator('em')
    await expect(em).toContainText('test text')
  })

  test('toolbar H1 button converts paragraph', async ({ page }) => {
    const editor = page.locator('#editor .ProseMirror')
    await editor.click()
    await selectAll(page)
    const h1Btn = page.locator('#toolbar button[data-command="heading:level=1"]')
    await h1Btn.click()
    const h1 = editor.locator('h1')
    await expect(h1).toContainText('test text')
  })
})
