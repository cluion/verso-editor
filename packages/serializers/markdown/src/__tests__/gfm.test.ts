import { Schema } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { fromMarkdown, toMarkdown } from '../index'

const gfmSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['p', 0] as unknown as HTMLElement,
    },
    text: { group: 'inline' },
    table: {
      content: 'table_row+',
      group: 'block',
      tableRole: 'table',
      toDOM: () => ['table', ['tbody', 0]] as unknown as HTMLElement,
    },
    table_row: {
      content: 'table_cell+',
      tableRole: 'row',
      toDOM: () => ['tr', 0] as unknown as HTMLElement,
    },
    table_cell: {
      content: 'inline*',
      attrs: {
        colspan: { default: 1 },
        rowspan: { default: 1 },
        header: { default: false },
        align: { default: null },
      },
      tableRole: 'cell',
      toDOM: (node) => [node.attrs.header ? 'th' : 'td', 0] as unknown as HTMLElement,
    },
    taskList: {
      content: 'taskItem+',
      group: 'block',
      toDOM: () => ['ul', { 'data-type': 'taskList' }, 0] as unknown as HTMLElement,
    },
    taskItem: {
      content: 'inline*',
      attrs: { checked: { default: false } },
      toDOM: () => ['li', 0] as unknown as HTMLElement,
    },
    footnoteReference: {
      inline: true,
      group: 'inline',
      attrs: { id: { default: '' }, number: { default: 1 } },
      toDOM: () => ['sup', 0] as unknown as HTMLElement,
    },
    footnoteSection: {
      content: 'footnoteItem+',
      group: 'block',
      toDOM: () => ['section', 0] as unknown as HTMLElement,
    },
    footnoteItem: {
      content: 'inline*',
      group: 'block',
      attrs: { id: { default: '' }, number: { default: 1 } },
      toDOM: () => ['div', 0] as unknown as HTMLElement,
    },
  },
  marks: {
    strikethrough: {
      toDOM: () => ['s', 0] as unknown as HTMLElement,
      parseDOM: [{ tag: 's' }, { tag: 'del' }],
    },
    link: {
      attrs: { href: { default: '' } },
      toDOM: (mark) => ['a', { href: mark.attrs.href }, 0] as unknown as HTMLElement,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: (dom) => ({ href: (dom as HTMLElement).getAttribute('href') }),
        },
      ],
    },
  },
})

describe('GFM Markdown Serializer', () => {
  describe('strikethrough', () => {
    it('serializes strikethrough mark', () => {
      const doc = gfmSchema.nodes.doc.create(
        null,
        gfmSchema.nodes.paragraph.create(
          null,
          gfmSchema.text('deleted', [gfmSchema.marks.strikethrough.create()]),
        ),
      )
      const md = toMarkdown(doc)
      expect(md).toContain('~~deleted~~')
    })

    it('parses strikethrough from markdown', () => {
      const doc = fromMarkdown('~~deleted~~', gfmSchema)
      const text = doc.firstChild?.firstChild
      expect(text?.marks?.[0].type.name).toBe('strikethrough')
    })

    it('round-trips strikethrough', () => {
      const doc = gfmSchema.nodes.doc.create(
        null,
        gfmSchema.nodes.paragraph.create(
          null,
          gfmSchema.text('deleted', [gfmSchema.marks.strikethrough.create()]),
        ),
      )
      const md = toMarkdown(doc)
      const restored = fromMarkdown(md, gfmSchema)
      const text = restored.firstChild?.firstChild
      expect(text?.marks?.[0].type.name).toBe('strikethrough')
    })
  })

  describe('table', () => {
    it('serializes a table to GFM markdown', () => {
      const headerCell = gfmSchema.nodes.table_cell.create(
        { header: true },
        gfmSchema.text('Header'),
      )
      const bodyCell = gfmSchema.nodes.table_cell.create({ header: false }, gfmSchema.text('Cell'))
      const headerRow = gfmSchema.nodes.table_row.create(null, headerCell)
      const bodyRow = gfmSchema.nodes.table_row.create(null, bodyCell)
      const table = gfmSchema.nodes.table.create(null, [headerRow, bodyRow])

      const doc = gfmSchema.nodes.doc.create(null, table)
      const md = toMarkdown(doc)
      expect(md).toContain('Header')
      expect(md).toContain('Cell')
      expect(md).toContain('|')
      expect(md).toContain('---')
    })
  })

  describe('task list', () => {
    it('serializes unchecked task item', () => {
      const item = gfmSchema.nodes.taskItem.create({ checked: false }, gfmSchema.text('todo'))
      const list = gfmSchema.nodes.taskList.create(null, item)
      const doc = gfmSchema.nodes.doc.create(null, list)

      const md = toMarkdown(doc)
      expect(md).toContain('[ ]')
      expect(md).toContain('todo')
    })

    it('serializes checked task item', () => {
      const item = gfmSchema.nodes.taskItem.create({ checked: true }, gfmSchema.text('done'))
      const list = gfmSchema.nodes.taskList.create(null, item)
      const doc = gfmSchema.nodes.doc.create(null, list)

      const md = toMarkdown(doc)
      expect(md).toContain('[x]')
      expect(md).toContain('done')
    })
  })

  describe('autolink', () => {
    it('serializes bare URL link as autolink', () => {
      const doc = gfmSchema.nodes.doc.create(
        null,
        gfmSchema.nodes.paragraph.create(
          null,
          gfmSchema.text('https://example.com', [
            gfmSchema.marks.link.create({ href: 'https://example.com' }),
          ]),
        ),
      )
      const md = toMarkdown(doc)
      expect(md).toContain('<https://example.com>')
    })

    it('serializes titled link', () => {
      const doc = gfmSchema.nodes.doc.create(
        null,
        gfmSchema.nodes.paragraph.create(
          null,
          gfmSchema.text('click here', [
            gfmSchema.marks.link.create({ href: 'https://example.com' }),
          ]),
        ),
      )
      const md = toMarkdown(doc)
      expect(md).toContain('[click here](https://example.com)')
    })
  })

  describe('footnote', () => {
    it('serializes footnote reference', () => {
      const ref = gfmSchema.nodes.footnoteReference.create({ id: '1', number: 1 })
      const para = gfmSchema.nodes.paragraph.create(null, [gfmSchema.text('Text'), ref])
      const doc = gfmSchema.nodes.doc.create(null, para)

      const md = toMarkdown(doc)
      expect(md).toContain('[^1]')
    })

    it('serializes footnote section', () => {
      const item = gfmSchema.nodes.footnoteItem.create(
        { id: '1', number: 1 },
        gfmSchema.text('Footnote content'),
      )
      const section = gfmSchema.nodes.footnoteSection.create(null, item)
      const doc = gfmSchema.nodes.doc.create(null, section)

      const md = toMarkdown(doc)
      expect(md).toContain('[^1]:')
      expect(md).toContain('Footnote content')
    })
  })

  describe('SerializerRegistry', () => {
    it('uses GFM serializers by default', () => {
      const doc = gfmSchema.nodes.doc.create(
        null,
        gfmSchema.nodes.paragraph.create(
          null,
          gfmSchema.text('deleted', [gfmSchema.marks.strikethrough.create()]),
        ),
      )
      const md = toMarkdown(doc)
      expect(md).toContain('~~deleted~~')
    })

    it('allows extension entries', () => {
      const doc = gfmSchema.nodes.doc.create(
        null,
        gfmSchema.nodes.paragraph.create(null, gfmSchema.text('Hello')),
      )
      const md = toMarkdown(doc)
      const restored = fromMarkdown(md, gfmSchema)
      expect(restored.textContent).toBe('Hello')
    })
  })
})
