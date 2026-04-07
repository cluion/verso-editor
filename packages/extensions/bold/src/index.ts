import { MarkExtension } from '@verso-editor/core'

export const BoldExtension = MarkExtension.create({
  name: 'bold',
  markSpec: {
    parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
    toDOM: () => ['strong', 0] as const,
  },
})
