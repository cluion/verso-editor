import { MarkExtension } from '@verso-editor/core'

export const CodeExtension = MarkExtension.create({
  name: 'code',
  markSpec: {
    parseDOM: [{ tag: 'code' }],
    toDOM: () => ['code', 0] as const,
  },
})
