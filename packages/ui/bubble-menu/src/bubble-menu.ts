import type { Editor } from '@verso-editor/core'
import { setBlockType, toggleMark } from 'prosemirror-commands'
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
      const cmd = command ?? ''

      // Check if it's a mark or a node type
      const mark = state.schema.marks[cmd]
      if (mark) {
        const active = isMarkActive(state, cmd)
        button.setAttribute('aria-pressed', active ? 'true' : 'false')
        continue
      }

      // Node type active check (e.g. heading)
      const nodeType = state.schema.nodes[cmd]
      if (nodeType) {
        const active = isNodeActive(state, cmd)
        button.setAttribute('aria-pressed', active ? 'true' : 'false')
      }
    }
  }

  function isMarkActive(state: typeof view.state, markName: string): boolean {
    const mark = state.schema.marks[markName]
    if (!mark) return false
    const { from, $from, to, empty } = state.selection
    if (empty) return mark.isInSet(state.storedMarks ?? $from.marks()) !== undefined
    return state.doc.rangeHasMark(from, to, mark)
  }

  function isNodeActive(state: typeof view.state, nodeName: string): boolean {
    const nodeType = state.schema.nodes[nodeName]
    if (!nodeType) return false
    const { $from } = state.selection
    for (let d = $from.depth; d > 0; d--) {
      if ($from.node(d).type === nodeType) return true
    }
    return $from.parent.type === nodeType
  }

  function executeCommand(editorInstance: Editor, command: string) {
    const { state, dispatch } = editorInstance.view

    // Try mark toggle first
    const mark = state.schema.marks[command]
    if (mark) {
      toggleMark(mark)(state, dispatch)
      return
    }

    // Try node type toggle (e.g. heading1 → toggle between heading and paragraph)
    const nodeType = state.schema.nodes[command]
    if (nodeType) {
      if (isNodeActive(state, command)) {
        // Toggle back to paragraph
        const paragraph = state.schema.nodes.paragraph
        if (paragraph) {
          setBlockType(paragraph)(state, dispatch)
        }
      } else {
        setBlockType(nodeType)(state, dispatch)
      }
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
