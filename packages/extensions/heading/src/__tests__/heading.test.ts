import { Editor } from '@verso-editor/core'
import { describe, expect, it } from 'vitest'
import { HeadingExtension } from '../index'

describe('HeadingExtension', () => {
  it('has name heading', () => {
    expect(HeadingExtension.name).toBe('heading')
  })

  it('has nodeSpec defined', () => {
    expect(HeadingExtension.nodeSpec).toBeDefined()
  })

  it('has default options.levels', () => {
    expect(HeadingExtension.options.levels).toEqual([1, 2, 3, 4, 5, 6])
  })

  describe('nodeSpec', () => {
    it('content is inline*', () => {
      expect(HeadingExtension.nodeSpec?.content).toBe('inline*')
    })

    it('group is block', () => {
      expect(HeadingExtension.nodeSpec?.group).toBe('block')
    })

    it('attrs has level with default 1', () => {
      const attrs = HeadingExtension.nodeSpec?.attrs as { level: { default: number } }
      expect(attrs.level.default).toBe(1)
    })

    it('toDOM returns correct tag based on level', () => {
      const spec = HeadingExtension.nodeSpec
      for (let level = 1; level <= 6; level++) {
        const node = { attrs: { level } }
        const dom = spec?.toDOM?.(node as never)
        expect(dom).toEqual([`h${level}`, 0])
      }
    })
  })

  describe('Editor integration', () => {
    function createEditor() {
      const element = document.createElement('div')
      document.body.appendChild(element)
      const editor = new Editor({ element, extensions: [HeadingExtension] })
      return { editor, element }
    }

    it('registers heading node in schema', () => {
      const { editor } = createEditor()
      expect(editor.schema.nodes.heading).toBeDefined()
      editor.destroy()
    })

    it('setContent with h1 HTML', () => {
      const { editor } = createEditor()
      editor.setContent('<h1>Title</h1>')
      const html = editor.getHTML()
      expect(html).toContain('<h1>')
      expect(html).toContain('Title')
      editor.destroy()
    })

    it('setContent with all heading levels h1-h6', () => {
      const { editor } = createEditor()
      for (let level = 1; level <= 6; level++) {
        editor.setContent(`<h${level}>Heading ${level}</h${level}>`)
        const html = editor.getHTML()
        expect(html).toContain(`<h${level}>`)
        expect(html).toContain(`Heading ${level}`)
      }
      editor.destroy()
    })

    it('roundtrip preserves heading level', () => {
      const { editor } = createEditor()
      editor.setContent('<h3>Level 3</h3>')
      const html = editor.getHTML()
      expect(html).toContain('<h3>')
      expect(html).toContain('Level 3')
      expect(html).toContain('</h3>')
      editor.destroy()
    })

    it('default level is 1 when no attr specified', () => {
      const { editor } = createEditor()
      editor.setContent('<h1>Default</h1>')
      const html = editor.getHTML()
      expect(html).toContain('<h1>')
      editor.destroy()
    })
  })
})
