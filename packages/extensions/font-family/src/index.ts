import { MarkExtension } from '@verso-editor/core'
import type { MarkType } from 'prosemirror-model'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

export const FontFamilyExtension = MarkExtension.create({
  name: 'fontFamily',
  markSpec: {
    attrs: { fontFamily: { default: '' } },
    parseDOM: [
      {
        tag: 'span[style]',
        getAttrs: (dom) => {
          const style = (dom as HTMLElement).getAttribute('style') ?? ''
          const match = style.match(/(?:^|;)\s*font-family:\s*([^;]+)/i)
          return match ? { fontFamily: match[1].trim() } : false
        },
      },
    ],
    toDOM: (mark) => {
      const fontFamily = mark.attrs.fontFamily as string
      return ['span', { style: `font-family: ${fontFamily}` }, 0] as unknown as HTMLElement
    },
  },
})

export function setFontFamily(fontFamily: string, markType: MarkType): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to } = state.selection
    if (from === to) return false
    if (dispatch) {
      dispatch(state.tr.addMark(from, to, markType.create({ fontFamily })))
    }
    return true
  }
}

export function unsetFontFamily(markType: MarkType): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to } = state.selection
    if (from === to) return false
    if (dispatch) {
      dispatch(state.tr.removeMark(from, to, markType))
    }
    return true
  }
}
