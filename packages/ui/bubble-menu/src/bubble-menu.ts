import type { Editor } from '@verso-editor/core'
import { toggleMark } from 'prosemirror-commands'
import type { EditorView } from 'prosemirror-view'

export interface BubbleMenuItem {
  command: string
  label: string
}

export interface BubbleMenuOptions {
  editor: Editor
  element: HTMLElement
  items: BubbleMenuItem[]
  shouldShow?: (view: EditorView) => boolean
}

interface BubbleMenu {
  destroy: () => void
}

export function createBubbleMenu(options: BubbleMenuOptions): BubbleMenu {
  const { editor, element, items, shouldShow } = options
  let destroyed = false
  let cleanupAutoUpdate: (() => void) | undefined

  // Setup element
  element.setAttribute('role', 'toolbar')
  element.setAttribute('aria-label', 'Formatting toolbar')
  element.style.display = 'none'

  // Create buttons
  for (const item of items) {
    const button = document.createElement('button')
    button.textContent = item.label
    button.setAttribute('data-command', item.command)
    button.setAttribute('aria-pressed', 'false')
    button.addEventListener('click', () => {
      executeCommand(editor, item.command)
    })
    element.appendChild(button)
  }

  // Plugin view.update listens to selection changes
  const view = editor.view

  // Override update to listen for selection changes
  const originalUpdate = view.updateState.bind(view)
  view.updateState = (state) => {
    originalUpdate(state)
    if (!destroyed) {
      updateVisibility()
    }
  }

  function updateVisibility() {
    if (destroyed) return

    const { empty } = view.state.selection
    const hasFocus = view.hasFocus()

    if (empty || !hasFocus) {
      hide()
      return
    }

    if (shouldShow && !shouldShow(view)) {
      hide()
      return
    }

    show()
    updateActiveStates()
  }

  function show() {
    element.style.display = ''
  }

  function hide() {
    element.style.display = 'none'
    if (cleanupAutoUpdate) {
      cleanupAutoUpdate()
      cleanupAutoUpdate = undefined
    }
  }

  function updateActiveStates() {
    const { state } = view
    const buttons = element.querySelectorAll('button[data-command]')
    for (const button of buttons) {
      const command = button.getAttribute('dataCommand') ?? button.getAttribute('data-command')
      const active = isMarkActive(state, command ?? '')
      button.setAttribute('aria-pressed', active ? 'true' : 'false')
    }
  }

  function isMarkActive(state: typeof view.state, markName: string): boolean {
    const mark = state.schema.marks[markName]
    if (!mark) return false
    const { from, $from, to, empty } = state.selection
    if (empty) return mark.isInSet(state.storedMarks ?? $from.marks()) !== undefined
    return state.doc.rangeHasMark(from, to, mark)
  }

  function executeCommand(editorInstance: Editor, command: string) {
    const { state, dispatch } = editorInstance.view
    const mark = state.schema.marks[command]
    if (mark) {
      toggleMark(mark)(state, dispatch)
    }
  }

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      // Restore original updateState
      view.updateState = originalUpdate
      hide()
      element.textContent = ''
      element.removeAttribute('role')
      element.removeAttribute('aria-label')
    },
  }
}
