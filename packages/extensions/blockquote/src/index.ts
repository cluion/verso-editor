import { NodeExtension } from '@verso-editor/core'

export const BlockquoteExtension = NodeExtension.create({
  name: 'blockquote',
  nodeSpec: {
    content: 'block+',
    group: 'block',
    toDOM: () => ['blockquote', 0] as unknown as HTMLElement,
  },
})
