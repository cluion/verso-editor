import { MarkExtension } from '@verso-editor/core'
import type { MarkType } from 'prosemirror-model'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

export const FontSizeExtension = MarkExtension.create({
  name: 'fontSize',
  markSpec: {
    attrs: { fontSize: { default: '' } },
    parseDOM: [
      {
        tag: 'span[style]',
        getAttrs: (dom) => {
          const style = (dom as HTMLElement).getAttribute('style') ?? ''
          const match = style.match(/(?:^|;)\s*font-size:\s*([^;]+)/i)
          return match ? { fontSize: match[1].trim() } : false
        },
      },
    ],
    toDOM: (mark) => {
      const fontSize = mark.attrs.fontSize as string
      return ['span', { style: `font-size: ${fontSize}` }, 0] as unknown as HTMLElement
    },
  },
})

export function setFontSize(fontSize: string, markType: MarkType): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to } = state.selection
    if (from === to) return false
    if (dispatch) {
      dispatch(state.tr.addMark(from, to, markType.create({ fontSize })))
    }
    return true
  }
}

export function unsetFontSize(markType: MarkType): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to } = state.selection
    if (from === to) return false
    if (dispatch) {
      dispatch(state.tr.removeMark(from, to, markType))
    }
    return true
  }
}
