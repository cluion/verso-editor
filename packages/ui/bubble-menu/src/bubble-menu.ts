import type { Editor } from '@verso-editor/core'
import { setBlockType, toggleMark } from 'prosemirror-commands'
import type { EditorState } from 'prosemirror-state'
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

  // Setup element
  element.setAttribute('role', 'toolbar')
  element.setAttribute('aria-label', 'Bubble menu')
  element.style.display = 'none'
  element.style.position = 'fixed'
  element.style.zIndex = '1000'

  // Prevent editor blur when clicking bubble menu buttons
  element.addEventListener('mousedown', (e) => {
    e.preventDefault()
  })

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

  // Move to body to avoid parent CSS interfering with fixed positioning
  document.body.appendChild(element)

  // --- Event listeners ---

  // Editor update: show/hide based on selection state
  function onEditorUpdate() {
    if (destroyed) return
    // Defer to next frame so ProseMirror state + DOM are fully settled
    requestAnimationFrame(() => {
      if (destroyed) return
      updateVisibility()
    })
  }
  editor.on('update', onEditorUpdate)

  // Editor blur: always hide
  function onEditorBlur() {
    if (destroyed) return
    // Small delay so click on bubble menu button registers first
    setTimeout(() => {
      if (destroyed) return
      if (!editor.view.hasFocus()) {
        hide()
      }
    }, 150)
  }
  editor.on('blur', onEditorBlur)

  // --- Visibility ---

  function updateVisibility() {
    if (destroyed) return

    const { empty } = editor.view.state.selection
    const hasFocus = editor.view.hasFocus()

    if (empty || !hasFocus) {
      hide()
      return
    }

    if (shouldShow && !shouldShow(editor.view)) {
      hide()
      return
    }

    show()
    updateActiveStates()
  }

  function show() {
    element.style.display = 'flex'
    // Wait for layout to compute offsetWidth/offsetHeight
    requestAnimationFrame(() => {
      if (destroyed) return
      positionBubble()
    })
  }

  function hide() {
    element.style.display = 'none'
  }

  function positionBubble() {
    const { from, to, empty } = editor.view.state.selection
    if (empty) return

    const view = editor.view
    const startCoords = view.coordsAtPos(from)
    const endCoords = view.coordsAtPos(to)

    const selectionCenter = (startCoords.left + endCoords.right) / 2
    const elementWidth = element.offsetWidth
    const left = Math.max(
      8,
      Math.min(selectionCenter - elementWidth / 2, window.innerWidth - elementWidth - 8),
    )

    const top = startCoords.top - element.offsetHeight - 8

    element.style.left = `${left}px`
    element.style.top = `${top}px`
  }

  // --- Active states ---

  function updateActiveStates() {
    const { state } = editor.view
    const buttons = element.querySelectorAll('button[data-command]')
    for (const button of buttons) {
      const command = button.getAttribute('dataCommand') ?? button.getAttribute('data-command')
      const cmd = command ?? ''

      const mark = state.schema.marks[cmd]
      if (mark) {
        const active = isMarkActive(state, cmd)
        button.setAttribute('aria-pressed', active ? 'true' : 'false')
        button.classList.toggle('active', active)
        continue
      }

      const parsed = parseCommand(cmd)
      const nodeType = state.schema.nodes[parsed.nodeName]
      if (nodeType) {
        const active = isNodeActive(state, parsed.nodeName, parsed.attrs)
        button.setAttribute('aria-pressed', active ? 'true' : 'false')
        button.classList.toggle('active', active)
      }
    }
  }

  // --- Helpers ---

  function isMarkActive(state: EditorState, markName: string): boolean {
    const mark = state.schema.marks[markName]
    if (!mark) return false
    const { from, $from, to, empty } = state.selection
    if (empty) return mark.isInSet(state.storedMarks ?? $from.marks()) !== undefined
    return state.doc.rangeHasMark(from, to, mark)
  }

  function isNodeActive(
    state: EditorState,
    nodeName: string,
    attrs?: Record<string, unknown>,
  ): boolean {
    const nodeType = state.schema.nodes[nodeName]
    if (!nodeType) return false
    const { $from } = state.selection
    for (let d = $from.depth; d > 0; d--) {
      const node = $from.node(d)
      if (node.type === nodeType) {
        if (!attrs) return true
        return Object.entries(attrs).every(([key, val]) => node.attrs[key] === val)
      }
    }
    if ($from.parent.type === nodeType) {
      if (!attrs) return true
      return Object.entries(attrs).every(([key, val]) => $from.parent.attrs[key] === val)
    }
    return false
  }

  function parseCommand(command: string): { nodeName: string; attrs?: Record<string, unknown> } {
    const colonIdx = command.indexOf(':')
    if (colonIdx === -1) return { nodeName: command }

    const nodeName = command.slice(0, colonIdx)
    const attrsPart = command.slice(colonIdx + 1)
    const attrs: Record<string, unknown> = {}
    for (const pair of attrsPart.split(',')) {
      const eqIdx = pair.indexOf('=')
      if (eqIdx !== -1) {
        const key = pair.slice(0, eqIdx)
        const rawVal = pair.slice(eqIdx + 1)
        const numVal = Number(rawVal)
        attrs[key] = Number.isNaN(numVal) ? rawVal : numVal
      }
    }
    return { nodeName, attrs }
  }

  function executeCommand(editorInstance: Editor, command: string) {
    const { state, dispatch } = editorInstance.view

    const mark = state.schema.marks[command]
    if (mark) {
      toggleMark(mark)(state, dispatch)
      return
    }

    const { nodeName, attrs } = parseCommand(command)
    const nodeType = state.schema.nodes[nodeName]
    if (nodeType) {
      if (isNodeActive(state, nodeName, attrs)) {
        const paragraph = state.schema.nodes.paragraph
        if (paragraph) {
          setBlockType(paragraph)(state, dispatch)
        }
      } else {
        setBlockType(nodeType, attrs)(state, dispatch)
      }
    }
  }

  return {
    destroy() {
      if (destroyed) return
      destroyed = true
      editor.off('update', onEditorUpdate)
      editor.off('blur', onEditorBlur)
      hide()
      element.textContent = ''
      element.removeAttribute('role')
      element.removeAttribute('aria-label')
      element.style.position = ''
      element.style.zIndex = ''
      element.style.top = ''
      element.style.left = ''
      element.style.display = ''
      element.remove()
    },
  }
}
