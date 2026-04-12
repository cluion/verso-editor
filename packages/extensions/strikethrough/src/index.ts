import { MarkExtension } from '@verso-editor/core'

export const StrikethroughExtension = MarkExtension.create({
  name: 'strikethrough',
  markSpec: {
    parseDOM: [{ tag: 's' }, { tag: 'del' }],
    toDOM: () => ['s', 0] as const,
  },
})
