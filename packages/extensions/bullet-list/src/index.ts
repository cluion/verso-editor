import { NodeExtension } from '@verso-editor/core'

export const BulletListExtension = NodeExtension.create({
  name: 'bullet_list',
  nodeSpec: {
    content: 'listItem+',
    group: 'block',
    toDOM: () => ['ul', 0] as unknown as HTMLElement,
    parseDOM: [{ tag: 'ul' }],
  },
})
