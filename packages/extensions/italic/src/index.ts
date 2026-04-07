import { MarkExtension } from '@verso-editor/core'

export const ItalicExtension = MarkExtension.create({
  name: 'italic',
  markSpec: {
    parseDOM: [{ tag: 'em' }, { tag: 'i' }],
    toDOM: () => ['em', 0] as const,
  },
})
