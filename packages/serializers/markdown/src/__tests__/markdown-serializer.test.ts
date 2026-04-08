import { Schema } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { fromMarkdown, toMarkdown } from '../index'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['p', 0] as unknown as HTMLElement,
    },
    heading: {
      content: 'inline*',
      group: 'block',
      attrs: { level: { default: 1 } },
      toDOM: (node) => [`h${node.attrs.level}`, 0] as unknown as HTMLElement,
    },
    text: { group: 'inline' },
    code_block: {
      content: 'text*',
      group: 'block',
      marks: '',
      toDOM: () => ['pre', ['code', 0]] as unknown as HTMLElement,
    },
  },
  marks: {
    em: {
      toDOM: () => ['em', 0] as unknown as HTMLElement,
      parseDOM: [{ tag: 'em' }],
    },
    strong: {
      toDOM: () => ['strong', 0] as unknown as HTMLElement,
      parseDOM: [{ tag: 'strong' }],
    },
  },
})

describe('Markdown Serializer', () => {
  describe('toMarkdown', () => {
    it('serializes a paragraph to markdown', () => {
      const doc = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('Hello world')),
      )
      const md = toMarkdown(doc)
      expect(md).toContain('Hello world')
    })

    it('serializes bold text', () => {
      const doc = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('bold', [schema.marks.strong.create()])),
      )
      const md = toMarkdown(doc)
      expect(md).toContain('**bold**')
    })

    it('serializes italic text', () => {
      const doc = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('italic', [schema.marks.em.create()])),
      )
      const md = toMarkdown(doc)
      expect(md).toContain('*italic*')
    })
  })

  describe('fromMarkdown', () => {
    it('parses a simple paragraph', () => {
      const doc = fromMarkdown('Hello world', schema)
      expect(doc.textContent).toBe('Hello world')
    })

    it('parses bold text', () => {
      const doc = fromMarkdown('**bold**', schema)
      const text = doc.firstChild?.firstChild
      expect(text?.marks?.[0].type.name).toBe('strong')
    })

    it('parses italic text', () => {
      const doc = fromMarkdown('*italic*', schema)
      const text = doc.firstChild?.firstChild
      expect(text?.marks?.[0].type.name).toBe('em')
    })

    it('parses a heading', () => {
      const doc = fromMarkdown('# Hello', schema)
      expect(doc.firstChild?.type.name).toBe('heading')
    })
  })

  describe('round-trip', () => {
    it('round-trips plain text', () => {
      const doc = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('Hello')),
      )
      const md = toMarkdown(doc)
      const restored = fromMarkdown(md, schema)
      expect(restored.textContent).toBe('Hello')
    })
  })
})
