import { NodeExtension } from '@verso-editor/core'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

export const BookmarkExtension = NodeExtension.create({
  name: 'bookmark',
  nodeSpec: {
    inline: true,
    group: 'inline',
    atom: true,
    attrs: {
      id: { default: '' },
      name: { default: '' },
    },
    parseDOM: [
      {
        tag: 'span[data-type="bookmark"]',
        getAttrs: (dom) => {
          const el = dom as HTMLElement
          return {
            id: el.getAttribute('data-id') ?? '',
            name: el.getAttribute('data-name') ?? '',
          }
        },
      },
    ],
    toDOM: (node) => [
      'span',
      {
        'data-type': 'bookmark',
        'data-id': node.attrs.id,
        'data-name': node.attrs.name,
        class: 'verso-bookmark',
      },
    ],
  },
})

export function goToBookmark(id: string): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    let found = false
    let targetPos = -1

    state.doc.descendants((node, pos) => {
      if (found) return false
      if (node.type.name === 'bookmark' && node.attrs.id === id) {
        targetPos = pos
        found = true
        return false
      }
      return true
    })

    if (!found) return false

    if (dispatch) {
      const tr = state.tr.setSelection(
        state.selection.constructor.near(state.doc.resolve(targetPos + 1)),
      )
      dispatch(tr)
    }
    return true
  }
}
