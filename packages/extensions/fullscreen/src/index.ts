import { Extension } from '@verso-editor/core'
import type { Command, EditorState, Transaction } from 'prosemirror-state'

export const FullscreenExtension = Extension.create({
  name: 'fullscreen',
  commands: {
    toggleFullscreen: () => () => {
      const editorEl = document.querySelector('.verso-editor')
      if (!editorEl) return false

      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        editorEl.requestFullscreen()
      }
      return true
    },
  },
})

export function toggleFullscreen(): Command {
  return (_state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const editorEl = document.querySelector('.verso-editor')
    if (!editorEl) return false

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      editorEl.requestFullscreen()
    }
    if (dispatch) {
      const tr = _state.tr
      dispatch(tr)
    }
    return true
  }
}
