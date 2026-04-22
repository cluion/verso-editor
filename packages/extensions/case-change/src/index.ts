import { Extension } from '@verso-editor/core'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

export const CaseChangeExtension = Extension.create({
  name: 'caseChange',
})

export function toUpperCase(): Command {
  return transformCase('upper')
}

export function toLowerCase(): Command {
  return transformCase('lower')
}

export function toTitleCase(): Command {
  return transformCase('title')
}

function transformCase(mode: 'upper' | 'lower' | 'title'): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to, empty } = state.selection
    if (empty) return false

    const text = state.doc.textBetween(from, to)
    let transformed: string
    switch (mode) {
      case 'upper':
        transformed = text.toUpperCase()
        break
      case 'lower':
        transformed = text.toLowerCase()
        break
      case 'title':
        transformed = text.replace(/\b\w/g, (c) => c.toUpperCase())
        break
    }

    if (dispatch) {
      const tr = state.tr.insertText(transformed, from, to)
      dispatch(tr)
    }
    return true
  }
}
