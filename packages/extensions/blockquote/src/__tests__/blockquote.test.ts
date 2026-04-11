import { Editor } from '@verso-editor/core'
import { describe, expect, it } from 'vitest'
import { BlockquoteExtension } from '../index'

describe('BlockquoteExtension', () => {
  it('has name blockquote', () => {
    expect(BlockquoteExtension.name).toBe('blockquote')
  })

  it('has nodeSpec defined', () => {
    expect(BlockquoteExtension.nodeSpec).toBeDefined()
  })

  describe('nodeSpec', () => {
    it('content allows block+', () => {
      expect(BlockquoteExtension.nodeSpec?.content).toBe('block+')
    })

    it('group is block', () => {
      expect(BlockquoteExtension.nodeSpec?.group).toBe('block')
    })

    it('toDOM returns ["blockquote", 0]', () => {
      const dom = BlockquoteExtension.nodeSpec?.toDOM?.()
      expect(dom).toEqual(['blockquote', 0])
    })
  })

  describe('Editor integration', () => {
    function createEditor() {
      const element = document.createElement('div')
      document.body.appendChild(element)
      const editor = new Editor({ element, extensions: [BlockquoteExtension] })
      return { editor, element }
    }

    it('registers blockquote node in schema', () => {
      const { editor } = createEditor()
      expect(editor.schema.nodes.blockquote).toBeDefined()
      editor.destroy()
    })

    it('setContent with blockquote HTML', () => {
      const { editor } = createEditor()
      editor.setContent('<blockquote><p>Quoted text</p></blockquote>')
      const html = editor.getHTML()
      expect(html).toContain('<blockquote>')
      expect(html).toContain('Quoted text')
      editor.destroy()
    })

    it('getHTML outputs blockquote tag', () => {
      const { editor } = createEditor()
      editor.setContent('<blockquote><p>Hello</p></blockquote>')
      const html = editor.getHTML()
      expect(html).toMatch(/<blockquote>.*<\/blockquote>/s)
      editor.destroy()
    })

    it('blockquote can contain multiple blocks', () => {
      const { editor } = createEditor()
      editor.setContent('<blockquote><p>First</p><p>Second</p></blockquote>')
      const html = editor.getHTML()
      expect(html).toContain('First')
      expect(html).toContain('Second')
      editor.destroy()
    })

    it('roundtrip preserves blockquote content', () => {
      const { editor } = createEditor()
      const input = '<blockquote><p>Test content</p></blockquote>'
      editor.setContent(input)
      const output = editor.getHTML()
      expect(output).toContain('<blockquote>')
      expect(output).toContain('Test content')
      editor.destroy()
    })
  })
})
