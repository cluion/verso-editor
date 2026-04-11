import { Schema } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { fromHTML, toHTML } from '../index'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['p', 0] as unknown as HTMLElement,
    },
    text: { group: 'inline' },
  },
  marks: {
    bold: {
      toDOM: () => ['strong', 0] as unknown as HTMLElement,
      parseDOM: [{ tag: 'strong' }],
    },
    italic: {
      toDOM: () => ['em', 0] as unknown as HTMLElement,
      parseDOM: [{ tag: 'em' }],
    },
  },
})

describe('HTML Serializer', () => {
  describe('toHTML', () => {
    it('serializes a paragraph to HTML', () => {
      const doc = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('Hello')),
      )
      const html = toHTML(doc, schema)
      expect(html).toContain('<p>')
      expect(html).toContain('Hello')
      expect(html).toContain('</p>')
    })

    it('serializes marks to HTML', () => {
      const doc = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('bold', [schema.marks.bold.create()])),
      )
      const html = toHTML(doc, schema)
      expect(html).toContain('<strong>bold</strong>')
    })

    it('serializes multiple paragraphs', () => {
      const doc = schema.nodes.doc.create(null, [
        schema.nodes.paragraph.create(null, schema.text('First')),
        schema.nodes.paragraph.create(null, schema.text('Second')),
      ])
      const html = toHTML(doc, schema)
      expect(html).toContain('First')
      expect(html).toContain('Second')
    })

    it('wraps output in a fragment without extra wrapper', () => {
      const doc = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('Hi')),
      )
      const html = toHTML(doc, schema)
      // Should not have <div> wrapper from DOMSerializer
      expect(html).not.toContain('<div')
    })
  })

  describe('fromHTML', () => {
    it('parses a simple paragraph', () => {
      const doc = fromHTML('<p>Hello</p>', schema)
      expect(doc.childCount).toBe(1)
      expect(doc.firstChild?.textContent).toBe('Hello')
    })

    it('parses marks', () => {
      const doc = fromHTML('<p><strong>bold</strong></p>', schema)
      const paragraph = doc.firstChild
      expect(paragraph).toBeDefined()
      const text = paragraph?.firstChild
      expect(text).toBeDefined()
      expect(text?.marks).toHaveLength(1)
      expect(text?.marks?.[0].type.name).toBe('bold')
    })

    it('parses multiple paragraphs', () => {
      const doc = fromHTML('<p>First</p><p>Second</p>', schema)
      expect(doc.childCount).toBe(2)
    })

    it('round-trips through toHTML and fromHTML', () => {
      const original = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('Hello world')),
      )
      const html = toHTML(original, schema)
      const restored = fromHTML(html, schema)
      expect(restored.textContent).toBe('Hello world')
    })

    it('round-trips with marks', () => {
      const original = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('bold', [schema.marks.bold.create()])),
      )
      const html = toHTML(original, schema)
      const restored = fromHTML(html, schema)
      const text = restored.firstChild?.firstChild
      expect(text?.marks?.[0].type.name).toBe('bold')
    })

    it('parses italic marks', () => {
      const doc = fromHTML('<p><em>italic</em></p>', schema)
      const text = doc.firstChild?.firstChild
      expect(text?.marks?.[0].type.name).toBe('italic')
    })

    it('round-trips italic marks', () => {
      const original = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('italic', [schema.marks.italic.create()])),
      )
      const html = toHTML(original, schema)
      const restored = fromHTML(html, schema)
      const text = restored.firstChild?.firstChild
      expect(text?.marks?.[0].type.name).toBe('italic')
    })

    it('parses nested bold + italic marks', () => {
      const doc = fromHTML('<p><strong><em>both</em></strong></p>', schema)
      const text = doc.firstChild?.firstChild
      const markNames = text?.marks?.map((m) => m.type.name).sort()
      expect(markNames).toEqual(['bold', 'italic'])
    })

    it('handles empty paragraph', () => {
      const doc = fromHTML('<p></p>', schema)
      expect(doc.childCount).toBe(1)
    })

    it('round-trips multiple paragraphs with mixed marks', () => {
      const original = schema.nodes.doc.create(null, [
        schema.nodes.paragraph.create(null, schema.text('plain')),
        schema.nodes.paragraph.create(null, schema.text('bold', [schema.marks.bold.create()])),
        schema.nodes.paragraph.create(null, schema.text('italic', [schema.marks.italic.create()])),
      ])
      const html = toHTML(original, schema)
      const restored = fromHTML(html, schema)
      expect(restored.childCount).toBe(3)
    })
  })
})
