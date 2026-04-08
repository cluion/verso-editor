import { NodeExtension } from '@verso-editor/core'

export const ListItemExtension = NodeExtension.create({
  name: 'list_item',
  nodeSpec: {
    content: 'paragraph block*',
    group: 'listItem',
    toDOM: () => ['li', 0] as unknown as HTMLElement,
    parseDOM: [{ tag: 'li' }],
  },
})
