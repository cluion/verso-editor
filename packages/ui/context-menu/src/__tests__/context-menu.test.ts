import { describe, expect, it } from 'vitest'
import { ContextMenu } from '../index'

describe('ContextMenu', () => {
  it('creates instance', () => {
    const menu = new ContextMenu({ items: [] })
    expect(menu).toBeDefined()
    menu.destroy()
  })

  it('shows and hides menu', () => {
    const menu = new ContextMenu({ items: [] })
    menu.show(100, 100, [
      { label: 'Bold', command: () => {} },
      { label: 'Separator', command: () => {}, separator: true },
      { label: 'Italic', command: () => {} },
    ])
    const el = document.querySelector('.verso-context-menu')
    expect(el).not.toBeNull()

    menu.hide()
    expect(document.querySelector('.verso-context-menu')).toBeNull()
    menu.destroy()
  })

  it('destroys cleanly', () => {
    const menu = new ContextMenu({ items: [] })
    menu.show(100, 100, [{ label: 'Test', command: () => {} }])
    menu.destroy()
    expect(document.querySelector('.verso-context-menu')).toBeNull()
  })
})
