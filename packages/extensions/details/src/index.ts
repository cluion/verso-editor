import { NodeExtension } from '@verso-editor/core'

export { createDetailsNodeView } from './details-nodeview'

export const DetailsExtension = NodeExtension.create({
  name: 'details',
  nodeSpec: {
    content: 'details_summary details_content',
    group: 'block',
    attrs: {
      open: { default: false },
    },
    toDOM: (node) => {
      const attrs: Record<string, string> = { 'data-type': 'details' }
      if (node.attrs.open) attrs.open = ''
      return ['details', attrs, 0] as unknown as HTMLElement
    },
    parseDOM: [
      {
        tag: 'details',
        getAttrs: (dom) => ({
          open: (dom as HTMLElement).hasAttribute('open'),
        }),
      },
    ],
  },
})

export const DetailsSummaryExtension = NodeExtension.create({
  name: 'details_summary',
  nodeSpec: {
    content: 'inline*',
    group: 'block',
    toDOM: () => ['summary', 0] as unknown as HTMLElement,
    parseDOM: [{ tag: 'summary' }],
  },
})

export const DetailsContentExtension = NodeExtension.create({
  name: 'details_content',
  nodeSpec: {
    content: 'block+',
    group: 'block',
    toDOM: () => ['div', { 'data-type': 'details-content' }, 0] as unknown as HTMLElement,
    parseDOM: [{ tag: 'div[data-type="details-content"]' }],
  },
})
