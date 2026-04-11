import { type Node, Schema } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { fromJSON, toJSON } from '../index'

// Minimal schema for testing
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
  },
})

function createParagraph(text: string, marks = ''): Node {
  return schema.nodes.paragraph.create(
    null,
    schema.text(text, marks ? [schema.marks.bold.create()] : []),
  )
}

describe('JSON Serializer', () => {
  describe('toJSON', () => {
    it('serializes a simple document to JSON', () => {
      const doc = schema.nodes.doc.create(null, createParagraph('Hello'))
      const json = toJSON(doc)

      expect(json.type).toBe('doc')
      expect(json.content).toBeDefined()
      expect(json.content).toBeInstanceOf(Array)
    })

    it('preserves node types in JSON', () => {
      const doc = schema.nodes.doc.create(null, createParagraph('Hello'))
      const json = toJSON(doc)

      const paragraph = json.content[0]
      expect(paragraph.type).toBe('paragraph')
      expect(paragraph.content[0].text).toBe('Hello')
    })

    it('preserves marks in JSON', () => {
      const doc = schema.nodes.doc.create(null, createParagraph('bold', 'bold'))
      const json = toJSON(doc)

      const textNode = json.content[0].content[0]
      expect(textNode.marks).toBeDefined()
      expect(textNode.marks[0].type).toBe('bold')
    })

    it('round-trips through toJSON and fromJSON', () => {
      const doc = schema.nodes.doc.create(null, createParagraph('Hello'))
      const json = toJSON(doc)
      const restored = fromJSON(schema, json)

      expect(restored.eq(doc)).toBe(true)
    })

    it('round-trips a document with marks', () => {
      const doc = schema.nodes.doc.create(null, createParagraph('bold', 'bold'))
      const json = toJSON(doc)
      const restored = fromJSON(schema, json)

      expect(restored.eq(doc)).toBe(true)
    })

    it('handles multi-paragraph documents', () => {
      const doc = schema.nodes.doc.create(null, [
        createParagraph('First'),
        createParagraph('Second'),
      ])
      const json = toJSON(doc)
      const restored = fromJSON(schema, json)

      expect(restored.eq(doc)).toBe(true)
      expect(json.content).toHaveLength(2)
    })
  })

  describe('fromJSON', () => {
    it('creates a document from JSON', () => {
      const json = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello' }],
          },
        ],
      }

      const doc = fromJSON(schema, json)
      expect(doc.type.name).toBe('doc')
      expect(doc.childCount).toBe(1)
    })

    it('throws on invalid JSON structure', () => {
      expect(() => fromJSON(schema, {} as Record<string, unknown>)).toThrow()
    })

    it('restores marks from JSON', () => {
      const json = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'styled',
                marks: [{ type: 'bold' }],
              },
            ],
          },
        ],
      }

      const doc = fromJSON(schema, json)
      const text = doc.firstChild?.firstChild
      expect(text?.marks?.[0].type.name).toBe('bold')
    })
  })

  describe('edge cases', () => {
    it('handles empty paragraph', () => {
      const doc = schema.nodes.doc.create(null, schema.nodes.paragraph.create(null))
      const json = toJSON(doc)
      const restored = fromJSON(schema, json)
      expect(restored.eq(doc)).toBe(true)
    })

    it('handles multiple marks on same text', () => {
      const doc = schema.nodes.doc.create(
        null,
        schema.nodes.paragraph.create(null, schema.text('both', [schema.marks.bold.create()])),
      )
      const json = toJSON(doc)
      expect(json.content[0].content[0].marks).toHaveLength(1)

      const restored = fromJSON(schema, json)
      expect(restored.eq(doc)).toBe(true)
    })

    it('round-trips a document with mixed marked and plain text', () => {
      const doc = schema.nodes.doc.create(null, [
        schema.nodes.paragraph.create(null, [
          schema.text('plain '),
          schema.text('bold', [schema.marks.bold.create()]),
        ]),
      ])
      const json = toJSON(doc)
      const restored = fromJSON(schema, json)
      expect(restored.eq(doc)).toBe(true)
    })
  })
})
