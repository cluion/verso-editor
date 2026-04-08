import { NodeExtension } from '@verso-editor/core'

export const OrderedListExtension = NodeExtension.create({
  name: 'ordered_list',
  nodeSpec: {
    content: 'listItem+',
    group: 'block',
    attrs: {
      order: { default: 1, validate: 'number' as const },
    },
    toDOM: (node) => ['ol', { start: node.attrs.order }, 0] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'ol',
        getAttrs: (dom) => ({
          order: (dom as HTMLElement).hasAttribute('start')
            ? Number((dom as HTMLElement).getAttribute('start'))
            : 1,
        }),
      },
    ],
  },
})
