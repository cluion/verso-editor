import { Editor } from '@verso-editor/core'
import { describe, expect, it } from 'vitest'
import { createBubbleMenu } from '../bubble-menu'

describe('createBubbleMenu', () => {
  function setup() {
    const editorEl = document.createElement('div')
    document.body.appendChild(editorEl)
    const editor = new Editor({ element: editorEl })

    const menuEl = document.createElement('div')
    document.body.appendChild(menuEl)

    const menu = createBubbleMenu({
      editor,
      element: menuEl,
      items: [
        { command: 'bold', label: 'B' },
        { command: 'italic', label: 'I' },
      ],
    })

    return { editor, editorEl, menu, menuEl }
  }

  it('creates buttons inside the element', () => {
    const { menu, menuEl, editor } = setup()
    const buttons = menuEl.querySelectorAll('button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].textContent).toBe('B')
    expect(buttons[1].textContent).toBe('I')
    editor.destroy()
    menu.destroy()
  })

  it('is hidden by default', () => {
    const { menu, menuEl, editor } = setup()
    expect(menuEl.style.display).toBe('none')
    editor.destroy()
    menu.destroy()
  })

  it('sets ARIA attributes', () => {
    const { menu, menuEl, editor } = setup()
    expect(menuEl.getAttribute('role')).toBe('toolbar')
    expect(menuEl.getAttribute('aria-label')).toBeTruthy()
    const buttons = menuEl.querySelectorAll('button')
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false')
    editor.destroy()
    menu.destroy()
  })

  it('destroys cleanly', () => {
    const { menu, menuEl, editor } = setup()
    menu.destroy()
    expect(menuEl.querySelectorAll('button').length).toBe(0)
    editor.destroy()
  })

  it('destroy is idempotent', () => {
    const { menu, editor } = setup()
    expect(() => {
      menu.destroy()
      menu.destroy()
    }).not.toThrow()
    editor.destroy()
  })

  it('respects shouldShow returning false', () => {
    const editorEl = document.createElement('div')
    document.body.appendChild(editorEl)
    const editor = new Editor({ element: editorEl })
    const menuEl = document.createElement('div')
    document.body.appendChild(menuEl)

    const menu = createBubbleMenu({
      editor,
      element: menuEl,
      items: [{ command: 'bold', label: 'B' }],
      shouldShow: () => false,
    })

    expect(menuEl.style.display).toBe('none')
    menu.destroy()
    editor.destroy()
  })
})
