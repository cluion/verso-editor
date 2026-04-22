import { Extension } from '@verso-editor/core'
import type { Mark } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

let copiedMarks: Mark[] = []

export const FormatPainterExtension = Extension.create({
  name: 'formatPainter',
  plugins: [
    () => {
      const key = new PluginKey('formatPainter')
      return new Plugin({ key })
    },
  ],
  keymap: () => ({
    'Mod-Shift-c': copyMarkFormat(),
    'Mod-Shift-v': pasteMarkFormat(),
  }),
})

export function copyMarkFormat(): Command {
  return (state: EditorState): boolean => {
    const { from, empty } = state.selection
    if (empty) return false
    const $pos = state.doc.resolve(from)
    copiedMarks = [...($pos.marks() ?? [])]
    return true
  }
}

export function pasteMarkFormat(): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to, empty } = state.selection
    if (empty || copiedMarks.length === 0) return false

    if (dispatch) {
      let tr = state.tr
      for (const mark of copiedMarks) {
        const markType = state.schema.marks[mark.type.name]
        if (markType) {
          tr = tr.addMark(from, to, markType.create(mark.attrs))
        }
      }
      dispatch(tr)
    }
    return true
  }
}
