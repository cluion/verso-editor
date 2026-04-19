import { Extension, NodeExtension } from '@verso-editor/core'
import type { Node as PMNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

export const FootnoteReferenceExtension = NodeExtension.create({
  name: 'footnoteReference',
  nodeSpec: {
    inline: true,
    group: 'inline',
    attrs: {
      id: { default: '' },
      number: { default: 1 },
    },
    toDOM: (node) =>
      [
        'sup',
        {
          'data-type': 'footnote-ref',
          'data-id': node.attrs.id,
          class: 'verso-footnote-ref',
        },
        String(node.attrs.number),
      ] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'sup[data-type="footnote-ref"]',
        getAttrs: (dom) => ({
          id: (dom as HTMLElement).getAttribute('data-id') ?? '',
          number: Number((dom as HTMLElement).textContent) || 1,
        }),
      },
    ],
  },
})

export const FootnoteSectionExtension = NodeExtension.create({
  name: 'footnoteSection',
  nodeSpec: {
    content: 'footnoteItem+',
    group: 'block',
    toDOM: () =>
      [
        'section',
        { 'data-type': 'footnote-section', class: 'verso-footnote-section' },
        0,
      ] as unknown as HTMLElement,
    parseDOM: [{ tag: 'section[data-type="footnote-section"]' }],
  },
})

export const FootnoteItemExtension = NodeExtension.create({
  name: 'footnoteItem',
  nodeSpec: {
    content: 'inline*',
    group: 'block',
    attrs: {
      id: { default: '' },
      number: { default: 1 },
    },
    toDOM: (node) =>
      [
        'div',
        {
          'data-type': 'footnote-item',
          'data-id': node.attrs.id,
          class: 'verso-footnote-item',
        },
        ['sup', { class: 'verso-footnote-item-number' }, String(node.attrs.number)],
        ['span', { class: 'verso-footnote-item-content' }, 0],
      ] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'div[data-type="footnote-item"]',
        getAttrs: (dom) => ({
          id: (dom as HTMLElement).getAttribute('data-id') ?? '',
          number: Number((dom as HTMLElement).querySelector('sup')?.textContent) || 1,
        }),
      },
    ],
  },
})

export const FootnotesPlugin = Extension.create({
  name: 'footnotes',
  plugins: [
    () => {
      const key = new PluginKey('footnotes')
      return new Plugin({
        key,
        appendTransaction(transactions, _oldState, newState) {
          const docChanged = transactions.some((tr) => tr.docChanged)
          if (!docChanged) return null

          const footnoteRefType = newState.schema.nodes.footnoteReference
          const footnoteSectionType = newState.schema.nodes.footnoteSection
          const footnoteItemType = newState.schema.nodes.footnoteItem
          if (!footnoteRefType || !footnoteSectionType || !footnoteItemType) return null

          const refs: { id: string; pos: number }[] = []
          let sectionPos: number | null = null

          newState.doc.descendants((node, pos) => {
            if (node.type === footnoteRefType) {
              refs.push({ id: node.attrs.id, pos })
            }
            if (node.type === footnoteSectionType && sectionPos === null) {
              sectionPos = pos
            }
          })

          const tr = newState.tr

          // Assign sequential numbers to refs
          refs.forEach((ref, index) => {
            const number = index + 1
            const node = newState.doc.nodeAt(ref.pos)
            if (node && node.attrs.number !== number) {
              tr.setNodeMarkup(ref.pos, undefined, { ...node.attrs, number })
            }
          })

          // Build footnote section at end of document
          const items: PMNode[] = []
          refs.forEach((ref, index) => {
            const number = index + 1
            const id = ref.id || `fn-${number}`
            items.push(
              footnoteItemType.create({ id, number }, newState.schema.text(`Footnote ${number}`)),
            )
          })

          if (items.length > 0) {
            const section = footnoteSectionType.create(null, items)
            if (sectionPos !== null) {
              const sectionNode = newState.doc.nodeAt(sectionPos)
              if (sectionNode) {
                tr.replaceWith(sectionPos, sectionPos + sectionNode.nodeSize, section)
              }
            } else {
              tr.insert(newState.doc.content.size, section)
            }
          } else if (sectionPos !== null) {
            const sectionNode = newState.doc.nodeAt(sectionPos)
            if (sectionNode) {
              tr.delete(sectionPos, sectionPos + sectionNode.nodeSize)
            }
          }

          if (tr.docChanged) return tr
          return null
        },
      })
    },
  ],
})
