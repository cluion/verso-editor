import { NodeExtension } from '@verso-editor/core'

export const ParagraphExtension = NodeExtension.create({
  name: 'paragraph',
  nodeSpec: {
    content: 'inline*',
    group: 'block',
    toDOM: () => ['p', 0] as unknown as HTMLElement,
  },
})
