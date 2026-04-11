import { Editor } from '@verso-editor/core'
import { describe, expect, it } from 'vitest'
import { ImageExtension } from '../index'

describe('ImageExtension', () => {
  it('has name image', () => {
    expect(ImageExtension.name).toBe('image')
  })

  it('has nodeSpec with src/alt/title attrs', () => {
    expect(ImageExtension.nodeSpec).toBeDefined()
    expect(ImageExtension.nodeSpec.inline).toBe(true)
    expect(ImageExtension.nodeSpec.draggable).toBe(true)
  })

  describe('nodeSpec', () => {
    it('group is inline', () => {
      expect(ImageExtension.nodeSpec.group).toBe('inline')
    })

    it('attrs have correct defaults', () => {
      const attrs = ImageExtension.nodeSpec.attrs as Record<string, { default: unknown }>
      expect(attrs.src.default).toBe('')
      expect(attrs.alt.default).toBe('')
      expect(attrs.title.default).toBe('')
      expect(attrs.width.default).toBeNull()
      expect(attrs.height.default).toBeNull()
    })

    it('toDOM returns ["img", attrs]', () => {
      const node = { attrs: { src: 'test.png', alt: 'test', title: '', width: null, height: null } }
      const dom = ImageExtension.nodeSpec?.toDOM?.(node as never)
      expect((dom as unknown[])[0]).toBe('img')
    })

    it('parseDOM extracts src, alt, title, width, height', () => {
      const rule = ImageExtension.nodeSpec?.parseDOM?.[0] as {
        tag: string
        getAttrs: (dom: HTMLElement) => Record<string, unknown>
      }
      expect(rule.tag).toBe('img[src]')

      const el = document.createElement('img')
      el.setAttribute('src', 'photo.jpg')
      el.setAttribute('alt', 'A photo')
      el.setAttribute('title', 'My photo')
      el.setAttribute('width', '300')
      el.setAttribute('height', '200')
      const attrs = rule.getAttrs(el)
      expect(attrs.src).toBe('photo.jpg')
      expect(attrs.alt).toBe('A photo')
      expect(attrs.title).toBe('My photo')
      expect(attrs.width).toBe('300')
      expect(attrs.height).toBe('200')
    })

    it('parseDOM handles missing optional attrs', () => {
      const rule = ImageExtension.nodeSpec?.parseDOM?.[0] as {
        getAttrs: (dom: HTMLElement) => Record<string, unknown>
      }
      const el = document.createElement('img')
      el.setAttribute('src', 'photo.jpg')
      const attrs = rule.getAttrs(el)
      expect(attrs.src).toBe('photo.jpg')
      expect(attrs.alt).toBe('')
      expect(attrs.title).toBe('')
    })
  })

  describe('Editor integration', () => {
    function createEditor() {
      const element = document.createElement('div')
      document.body.appendChild(element)
      const editor = new Editor({ element, extensions: [ImageExtension] })
      return { editor, element }
    }

    it('registers image node in schema', () => {
      const { editor } = createEditor()
      expect(editor.schema.nodes.image).toBeDefined()
      editor.destroy()
    })

    it('setContent with image HTML', () => {
      const { editor } = createEditor()
      editor.setContent('<p><img src="test.png" alt="test"></p>')
      const html = editor.getHTML()
      expect(html).toContain('src="test.png"')
      expect(html).toContain('alt="test"')
      editor.destroy()
    })

    it('roundtrip preserves image attributes', () => {
      const { editor } = createEditor()
      editor.setContent('<p><img src="photo.jpg" alt="Photo" width="200" height="150"></p>')
      const html = editor.getHTML()
      expect(html).toContain('src="photo.jpg"')
      expect(html).toContain('alt="Photo"')
      editor.destroy()
    })
  })
})
