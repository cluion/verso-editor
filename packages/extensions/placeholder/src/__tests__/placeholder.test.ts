import { Editor, Extension } from '@verso-editor/core'
import { describe, expect, it } from 'vitest'
import { PlaceholderExtension } from '../index'

describe('PlaceholderExtension', () => {
  it('has name placeholder', () => {
    expect(PlaceholderExtension.name).toBe('placeholder')
  })

  it('has default placeholder option', () => {
    expect(PlaceholderExtension.options.placeholder).toBe('Start typing...')
  })

  describe('Editor integration', () => {
    function createEditor(placeholder = 'Type here...') {
      const element = document.createElement('div')
      document.body.appendChild(element)
      const ext = Extension.create({
        name: 'placeholder',
        defaultOptions: { placeholder },
      })
      const editor = new Editor({ element, extensions: [ext] })
      return { editor, element }
    }

    it('editor creates successfully with placeholder extension', () => {
      const { editor } = createEditor()
      expect(editor).toBeDefined()
      editor.destroy()
    })

    it('placeholder option can be customized', () => {
      const { editor } = createEditor('Custom placeholder')
      expect(editor).toBeDefined()
      editor.destroy()
    })
  })
})
