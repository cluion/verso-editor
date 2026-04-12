import { MarkExtension } from '@verso-editor/core'
import type { MarkType } from 'prosemirror-model'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

export const HighlightExtension = MarkExtension.create({
  name: 'highlight',
  markSpec: {
    attrs: { color: { default: '' } },
    parseDOM: [
      {
        tag: 'mark',
        getAttrs: (dom) => {
          const style = (dom as HTMLElement).getAttribute('style') ?? ''
          const match = style.match(/(?:^|;)\s*background-color:\s*([^;]+)/i)
          return match ? { color: match[1].trim() } : { color: '' }
        },
      },
    ],
    toDOM: (mark) => {
      const color = mark.attrs.color as string
      if (color) {
        return ['mark', { style: `background-color: ${color}` }, 0] as unknown as HTMLElement
      }
      return ['mark', 0] as unknown as HTMLElement
    },
  },
})

export function toggleHighlight(markType: MarkType, options?: { color?: string }): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to } = state.selection
    if (from === to) return false

    const hasHighlight = state.doc.rangeHasMark(from, to, markType)
    if (dispatch) {
      if (hasHighlight) {
        dispatch(state.tr.removeMark(from, to, markType))
      } else {
        const color = options?.color ?? ''
        dispatch(state.tr.addMark(from, to, markType.create({ color })))
      }
    }
    return true
  }
}
