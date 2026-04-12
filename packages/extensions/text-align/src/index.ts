import { Extension } from '@verso-editor/core'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

export const TextAlignExtension = Extension.create({
  name: 'textAlign',
})

export function setTextAlign(align: string): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { $from } = state.selection
    for (let d = $from.depth; d > 0; d--) {
      const node = $from.node(d)
      if (node.type.spec.attrs && 'textAlign' in node.type.spec.attrs) {
        if (dispatch) {
          const pos = $from.before(d)
          const tr = state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            textAlign: node.attrs.textAlign === align ? null : align,
          })
          dispatch(tr)
        }
        return true
      }
    }
    return false
  }
}
