import { MarkExtension } from '@verso-editor/core'

export const SuperscriptExtension = MarkExtension.create({
  name: 'superscript',
  markSpec: {
    parseDOM: [{ tag: 'sup' }],
    toDOM: () => ['sup', 0] as const,
  },
})
