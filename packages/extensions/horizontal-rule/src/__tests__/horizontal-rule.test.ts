import { Editor } from '@verso-editor/core'
import { describe, expect, it } from 'vitest'
import { HorizontalRuleExtension } from '../index'

describe('HorizontalRuleExtension', () => {
  it('has name horizontal_rule', () => {
    expect(HorizontalRuleExtension.name).toBe('horizontal_rule')
  })

  it('has nodeSpec defined', () => {
    expect(HorizontalRuleExtension.nodeSpec).toBeDefined()
  })

  describe('nodeSpec', () => {
    it('group is block', () => {
      expect(HorizontalRuleExtension.nodeSpec?.group).toBe('block')
    })

    it('toDOM returns ["hr"]', () => {
      const dom = HorizontalRuleExtension.nodeSpec?.toDOM?.()
      expect(dom).toEqual(['hr'])
    })
  })

  describe('Editor integration', () => {
    function createEditor() {
      const element = document.createElement('div')
      document.body.appendChild(element)
      const editor = new Editor({ element, extensions: [HorizontalRuleExtension] })
      return { editor, element }
    }

    it('registers horizontal_rule node in schema', () => {
      const { editor } = createEditor()
      expect(editor.schema.nodes.horizontal_rule).toBeDefined()
      editor.destroy()
    })

    it('setContent with hr HTML', () => {
      const { editor } = createEditor()
      editor.setContent('<hr>')
      const html = editor.getHTML()
      expect(html).toContain('<hr>')
      editor.destroy()
    })

    it('roundtrip preserves hr', () => {
      const { editor } = createEditor()
      editor.setContent('<p>Before</p><hr><p>After</p>')
      const html = editor.getHTML()
      expect(html).toContain('<hr>')
      expect(html).toContain('Before')
      expect(html).toContain('After')
      editor.destroy()
    })
  })
})
