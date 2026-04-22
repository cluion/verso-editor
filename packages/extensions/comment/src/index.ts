import { Extension, MarkExtension } from '@verso-editor/core'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

export const CommentMark = MarkExtension.create({
  name: 'comment',
  markSpec: {
    attrs: {
      id: { default: '' },
      threadId: { default: '' },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'span[data-type="comment"]',
        getAttrs: (dom) => {
          const el = dom as HTMLElement
          return {
            id: el.getAttribute('data-id') ?? '',
            threadId: el.getAttribute('data-thread-id') ?? '',
          }
        },
      },
    ],
    toDOM: (mark) => [
      'span',
      {
        'data-type': 'comment',
        'data-id': mark.attrs.id,
        'data-thread-id': mark.attrs.threadId,
        class: 'verso-comment',
      },
      0,
    ],
  },
})

interface CommentOptions {
  onClickComment: ((id: string, threadId: string) => void) | null
}

export const CommentExtension = Extension.create<CommentOptions>({
  name: 'comment',
  defaultOptions: {
    onClickComment: null,
  },
})

export function addComment(id: string, threadId: string): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { from, to, empty } = state.selection
    if (empty) return false

    const commentType = state.schema.marks.comment
    if (!commentType) return false

    if (dispatch) {
      const tr = state.tr.addMark(from, to, commentType.create({ id, threadId }))
      dispatch(tr)
    }
    return true
  }
}

export function removeComment(threadId: string): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const commentType = state.schema.marks.comment
    if (!commentType) return false

    let found = false
    let tr = state.tr

    state.doc.descendants((node, pos) => {
      if (found) return false
      const mark = node.marks.find((m) => m.type === commentType && m.attrs.threadId === threadId)
      if (mark) {
        tr = tr.removeMark(pos, pos + node.nodeSize, mark)
        found = true
        return false
      }
      return true
    })

    if (found && dispatch) {
      dispatch(tr)
    }
    return found
  }
}
