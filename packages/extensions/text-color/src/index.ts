import { MarkExtension } from '@verso-editor/core'
import type { MarkType } from 'prosemirror-model'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

export const TextColorExtension = MarkExtension.create({
  name: 'textColor',
  markSpec: {
    attrs: { color: { default: '' } },
    parseDOM: [
      {
        tag: 'span[style]',
        getAttrs: (dom) => {
          const style = (dom as HTMLElement).getAttribute('style') ?? ''
          const match = style.match(/(?:^|;)\s*color:\s*([^;]+)/i)
          return match ? { color: match[1].trim() } : false
        },
      },
    ],
    toDOM: (mark) => {
      const color = mark.attrs.color as string
      return ['span', { style: `color: ${color}` }, 0] as unknown as HTMLElement
    },
  },
})

export function setTextColor(color: string, markType: MarkType): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to } = state.selection
    if (from === to) return false
    if (dispatch) {
      dispatch(state.tr.addMark(from, to, markType.create({ color })))
    }
    return true
  }
}

export function unsetTextColor(markType: MarkType): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to } = state.selection
    if (from === to) return false
    if (dispatch) {
      dispatch(state.tr.removeMark(from, to, markType))
    }
    return true
  }
}
