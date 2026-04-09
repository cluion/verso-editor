import { describe, expect, it } from 'vitest'
import { Editor } from '../editor'

describe('Accessibility', () => {
  function createEditor() {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({ element })
    return { editor, element }
  }

  describe('Editor ARIA attributes', () => {
    it('sets role="textbox" on contenteditable element', () => {
      const { editor } = createEditor()
      expect(editor.view.dom.getAttribute('role')).toBe('textbox')
      editor.destroy()
    })

    it('sets aria-multiline="true"', () => {
      const { editor } = createEditor()
      expect(editor.view.dom.getAttribute('aria-multiline')).toBe('true')
      editor.destroy()
    })

    it('sets aria-label', () => {
      const { editor } = createEditor()
      expect(editor.view.dom.getAttribute('aria-label')).toBe('Rich text editor')
      editor.destroy()
    })

    it('uses custom aria-label from options', () => {
      const element = document.createElement('div')
      document.body.appendChild(element)
      const editor = new Editor({ element, ariaLabel: 'My content editor' })
      expect(editor.view.dom.getAttribute('aria-label')).toBe('My content editor')
      editor.destroy()
    })
  })

  describe('Screen Reader feedback', () => {
    it('creates an aria-live region for announcements', () => {
      const { editor, element } = createEditor()
      const liveRegion = element.querySelector('[aria-live="polite"]')
      expect(liveRegion).not.toBeNull()
      editor.destroy()
    })

    it('live region is visually hidden', () => {
      const { editor, element } = createEditor()
      const liveRegion = element.querySelector('[aria-live="polite"]') as HTMLElement
      expect(liveRegion?.className).toContain('vs-sr-only')
      editor.destroy()
    })

    it('announce method updates live region text', () => {
      const { editor, element } = createEditor()
      editor.announce('Bold applied')
      const liveRegion = element.querySelector('[aria-live="polite"]') as HTMLElement
      expect(liveRegion?.textContent).toBe('Bold applied')
      editor.destroy()
    })
  })
})
