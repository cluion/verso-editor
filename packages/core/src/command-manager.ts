import { lift, setBlockType, toggleMark, wrapIn } from 'prosemirror-commands'
import type { MarkType, NodeType } from 'prosemirror-model'
import type { EditorState, Transaction } from 'prosemirror-state'

type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean

// Command factories

export function createToggleMark(markType: MarkType): Command {
  return (state, dispatch) => toggleMark(markType)(state, dispatch)
}

export function createSetBlockType(nodeType: NodeType, attrs?: Record<string, unknown>): Command {
  return (state, dispatch) => setBlockType(nodeType, attrs)(state, dispatch)
}

export function createToggleBlockType(
  nodeType: NodeType,
  toggleType: NodeType,
  attrs?: Record<string, unknown>,
): Command {
  return (state, dispatch) => {
    const { $from } = state.selection
    const node = $from.parent
    if (
      node.type === nodeType &&
      (!attrs || Object.entries(attrs).every(([k, v]) => node.attrs[k] === v))
    ) {
      return setBlockType(toggleType)(state, dispatch)
    }
    return setBlockType(nodeType, attrs)(state, dispatch)
  }
}

export function createWrapIn(nodeType: NodeType): Command {
  return (state, dispatch) => wrapIn(nodeType)(state, dispatch)
}

export function createLift(): Command {
  return (state, dispatch) => lift(state, dispatch)
}

// isActive queries

export function isMarkActive(state: EditorState, markType: MarkType): boolean {
  const { from, $from, to, empty } = state.selection
  if (empty) {
    return markType.isInSet(state.storedMarks ?? $from.marks()) !== undefined
  }
  return state.doc.rangeHasMark(from, to, markType)
}

export function isNodeActive(
  state: EditorState,
  nodeType: NodeType,
  attrs?: Record<string, unknown>,
): boolean {
  const { $from } = state.selection
  for (let d = $from.depth; d > 0; d--) {
    const node = $from.node(d)
    if (node.type === nodeType) {
      if (!attrs) return true
      return Object.entries(attrs).every(([k, v]) => node.attrs[k] === v)
    }
  }
  return false
}
