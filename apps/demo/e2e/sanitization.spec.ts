import { expect, test } from '@playwright/test'

test.describe('Sanitization', () => {
  test('script tags are stripped from pasted content', async ({ page }) => {
    await page.goto('/')
    const editor = page.locator('#editor [contenteditable]').first()
    await editor.click()

    // Use evaluate to simulate paste with malicious HTML
    await page.evaluate(() => {
      const editorEl = document.querySelector('#editor [contenteditable]')
      if (!editorEl) return
      editorEl.focus()
      const dataTransfer = new DataTransfer()
      dataTransfer.setData('text/html', '<p>Safe</p><script>alert("xss")</script>')
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer,
      })
      editorEl.dispatchEvent(pasteEvent)
    })

    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).not.toContain('script')
    expect(html).not.toContain('alert')
  })

  test('event handler attributes are stripped', async ({ page }) => {
    await page.goto('/')
    const editor = page.locator('#editor [contenteditable]').first()
    await editor.click()

    await page.evaluate(() => {
      const editorEl = document.querySelector('#editor [contenteditable]')
      if (!editorEl) return
      editorEl.focus()
      const dataTransfer = new DataTransfer()
      dataTransfer.setData(
        'text/html',
        '<p onclick="alert(1)" onmouseover="alert(2)">Dangerous</p>',
      )
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer,
      })
      editorEl.dispatchEvent(pasteEvent)
    })

    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).not.toContain('onclick')
    expect(html).not.toContain('onmouseover')
  })

  test('safe HTML is preserved', async ({ page }) => {
    await page.goto('/')
    const editor = page.locator('#editor [contenteditable]').first()
    await editor.click()

    await page.evaluate(() => {
      const editorEl = document.querySelector('#editor [contenteditable]')
      if (!editorEl) return
      editorEl.focus()
      const dataTransfer = new DataTransfer()
      dataTransfer.setData('text/html', '<p><strong>Bold</strong> and <em>italic</em></p>')
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer,
      })
      editorEl.dispatchEvent(pasteEvent)
    })

    const html = await page.evaluate(() => {
      return (window as unknown as { editor: { getHTML: () => string } }).editor.getHTML()
    })
    expect(html).toContain('Bold')
    expect(html).toContain('italic')
  })
})
