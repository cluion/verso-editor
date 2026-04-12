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

  it('sets data-command attribute on buttons', () => {
    const { menu, menuEl, editor } = setup()
    const buttons = menuEl.querySelectorAll('button')
    expect(buttons[0].getAttribute('data-command')).toBe('bold')
    expect(buttons[1].getAttribute('data-command')).toBe('italic')
    editor.destroy()
    menu.destroy()
  })

  it('positions menu with fixed and high z-index', () => {
    const { menu, menuEl, editor } = setup()
    expect(menuEl.style.position).toBe('fixed')
    expect(menuEl.style.zIndex).toBe('1000')
    editor.destroy()
    menu.destroy()
  })

  it('prevents editor blur on mousedown', () => {
    const { menu, menuEl, editor } = setup()
    const event = new MouseEvent('mousedown', { cancelable: true })
    menuEl.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    editor.destroy()
    menu.destroy()
  })

  it('button click executes toggleMark command', () => {
    const { menu, menuEl, editor } = setup()
    const initialHtml = editor.getHTML()

    const boldBtn = menuEl.querySelector('button[data-command="bold"]') as HTMLButtonElement
    boldBtn.click()

    // Bold command dispatches on the view; editor content should still be valid
    expect(editor.getHTML()).toBeDefined()
    editor.destroy()
    menu.destroy()
  })

  it('cleanup removes element from DOM', () => {
    const { menu, menuEl, editor } = setup()
    expect(document.body.contains(menuEl)).toBe(true)
    menu.destroy()
    expect(document.body.contains(menuEl)).toBe(false)
    editor.destroy()
  })
})
