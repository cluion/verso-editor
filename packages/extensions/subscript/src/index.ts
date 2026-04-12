import { MarkExtension } from '@verso-editor/core'

export const SubscriptExtension = MarkExtension.create({
  name: 'subscript',
  markSpec: {
    parseDOM: [{ tag: 'sub' }],
    toDOM: () => ['sub', 0] as const,
  },
})
