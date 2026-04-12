import { MarkExtension } from '@verso-editor/core'

export const UnderlineExtension = MarkExtension.create({
  name: 'underline',
  markSpec: {
    parseDOM: [{ tag: 'u' }],
    toDOM: () => ['u', 0] as const,
  },
})
