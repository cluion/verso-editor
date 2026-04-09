import { Schema } from 'prosemirror-model'
import type { MarkSpec, NodeSpec } from 'prosemirror-model'

const nodes: Record<string, NodeSpec> = {
  doc: { content: 'block+' },

  paragraph: {
    group: 'block',
    content: 'inline*',
    parseDOM: [{ tag: 'p' }],
    toDOM: () => ['p', 0],
  },

  heading: {
    group: 'block',
    content: 'inline*',
    attrs: { level: { default: 1, validate: 'number' } },
    parseDOM: [1, 2, 3, 4, 5, 6].map((level) => ({
      tag: `h${level}`,
      attrs: { level },
    })),
    toDOM: (node) => [`h${node.attrs.level}`, 0],
  },

  blockquote: {
    group: 'block',
    content: 'block+',
    parseDOM: [{ tag: 'blockquote' }],
    toDOM: () => ['blockquote', 0],
  },

  code_block: {
    group: 'block',
    content: 'text*',
    marks: '',
    code: true,
    parseDOM: [{ tag: 'pre' }],
    toDOM: () => ['pre', ['code', 0]],
  },

  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM: () => ['hr'],
  },

  bullet_list: {
    group: 'block',
    content: 'list_item+',
    parseDOM: [{ tag: 'ul' }],
    toDOM: () => ['ul', 0],
  },

  ordered_list: {
    group: 'block',
    content: 'list_item+',
    attrs: { order: { default: 1, validate: 'number' } },
    parseDOM: [
      {
        tag: 'ol',
        getAttrs: (dom: HTMLElement) => ({ order: Number(dom.getAttribute('start')) || 1 }),
      },
    ],
    toDOM: (node) => (node.attrs.order === 1 ? ['ol', 0] : ['ol', { start: node.attrs.order }, 0]),
  },

  list_item: {
    content: 'paragraph block*',
    parseDOM: [{ tag: 'li' }],
    toDOM: () => ['li', 0],
  },

  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM: () => ['br'],
  },

  text: {
    group: 'inline',
  },
}

const marks: Record<string, MarkSpec> = {
  bold: {
    parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
    toDOM: () => ['strong', 0],
  },

  italic: {
    parseDOM: [{ tag: 'em' }, { tag: 'i' }],
    toDOM: () => ['em', 0],
  },

  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM: () => ['code', 0],
  },

  link: {
    attrs: {
      href: { validate: 'string' },
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs: (dom: HTMLElement) => {
          const href = dom.getAttribute('href') || ''
          const normalized = href
            .trim()
            .toLowerCase()
            .split('')
            .filter((ch) => {
              const code = ch.codePointAt(0) ?? 0
              return code > 0x1f && code !== 0x7f
            })
            .join('')
          if (/^(javascript|data|vbscript):/.test(normalized)) {
            return false
          }
          return {
            href,
            title: dom.getAttribute('title') || null,
          }
        },
      },
    ],
    toDOM: (mark) => {
      const attrs: Record<string, string> = { href: mark.attrs.href }
      if (mark.attrs.title) {
        attrs.title = mark.attrs.title
      }
      return ['a', attrs, 0]
    },
  },
}

export const defaultSchema = new Schema({ nodes, marks })
export { nodes as defaultNodeSpecs, marks as defaultMarkSpecs }
