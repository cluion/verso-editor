import { Editor } from '@verso-editor/core'
import { describe, expect, it } from 'vitest'
import { CodeBlockExtension } from '../index'

describe('CodeBlockExtension', () => {
  it('has name code_block', () => {
    expect(CodeBlockExtension.name).toBe('code_block')
  })

  it('has nodeSpec with marks empty string', () => {
    expect(CodeBlockExtension.nodeSpec).toBeDefined()
    expect(CodeBlockExtension.nodeSpec.marks).toBe('')
  })

  describe('nodeSpec', () => {
    it('content is text*', () => {
      expect(CodeBlockExtension.nodeSpec?.content).toBe('text*')
    })

    it('group is block', () => {
      expect(CodeBlockExtension.nodeSpec?.group).toBe('block')
    })

    it('attrs has language with default empty string', () => {
      const attrs = CodeBlockExtension.nodeSpec?.attrs as { language: { default: string } }
      expect(attrs.language.default).toBe('')
    })

    it('toDOM returns ["pre", {data-language}, ["code", 0]]', () => {
      const node = { attrs: { language: 'typescript' } }
      const dom = CodeBlockExtension.nodeSpec?.toDOM?.(node as never)
      expect((dom as unknown[])[0]).toBe('pre')
      expect((dom as unknown[])[1]).toEqual({ 'data-language': 'typescript' })
      expect((dom as unknown[])[2]).toEqual(['code', 0])
    })

    it('parseDOM extracts data-language attribute', () => {
      const rule = CodeBlockExtension.nodeSpec?.parseDOM?.[0] as {
        tag: string
        getAttrs: (dom: HTMLElement) => Record<string, unknown>
      }
      expect(rule.tag).toBe('pre')

      const el = document.createElement('pre')
      el.setAttribute('data-language', 'javascript')
      const attrs = rule.getAttrs(el)
      expect(attrs.language).toBe('javascript')
    })

    it('parseDOM defaults language to empty string', () => {
      const rule = CodeBlockExtension.nodeSpec?.parseDOM?.[0] as {
        getAttrs: (dom: HTMLElement) => Record<string, unknown>
      }
      const el = document.createElement('pre')
      const attrs = rule.getAttrs(el)
      expect(attrs.language).toBe('')
    })
  })

  describe('Editor integration', () => {
    function createEditor() {
      const element = document.createElement('div')
      document.body.appendChild(element)
      const editor = new Editor({ element, extensions: [CodeBlockExtension] })
      return { editor, element }
    }

    it('registers code_block node in schema', () => {
      const { editor } = createEditor()
      expect(editor.schema.nodes.code_block).toBeDefined()
      editor.destroy()
    })

    it('setContent with pre/code HTML', () => {
      const { editor } = createEditor()
      editor.setContent('<pre><code>console.log("hello")</code></pre>')
      const html = editor.getHTML()
      expect(html).toContain('console.log')
      expect(html).toContain('<pre')
      editor.destroy()
    })

    it('roundtrip preserves code block content', () => {
      const { editor } = createEditor()
      editor.setContent('<pre data-language="ts"><code>const x = 1</code></pre>')
      const html = editor.getHTML()
      expect(html).toContain('const x = 1')
      editor.destroy()
    })

    it('code_block disallows marks', () => {
      const { editor } = createEditor()
      const cb = editor.schema.nodes.code_block
      expect(cb.spec.marks).toBe('')
      editor.destroy()
    })
  })
})
