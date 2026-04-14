import { Extension } from '@verso-editor/core'
import { gapCursor } from 'prosemirror-gapcursor'

export const GapCursorExtension = Extension.create({
  name: 'gapCursor',
  plugins: [() => gapCursor()],
})
