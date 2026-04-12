import { baseKeymap, lift, setBlockType, toggleMark, wrapIn } from 'prosemirror-commands'
import { redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import type { Schema } from 'prosemirror-model'
import type { EditorState, Plugin, Transaction } from 'prosemirror-state'

type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean

export function createKeymapPlugins(schema: Schema): Plugin[] {
  return [
    // Layer 1: History (highest priority)
    keymap({
      'Mod-z': undo,
      'Mod-y': redo,
      'Mod-Shift-z': redo,
    }),

    // Layer 2: Formatting
    keymap(createFormattingKeymap(schema)),

    // Layer 3: baseKeymap (lowest priority, fallback)
    keymap(baseKeymap),
  ]
}

function createFormattingKeymap(schema: Schema): Record<string, Command> {
  const bindings: Record<string, Command> = {}

  // Marks
  if (schema.marks.bold) {
    bindings['Mod-b'] = toggleMark(schema.marks.bold) as Command
  }
  if (schema.marks.italic) {
    bindings['Mod-i'] = toggleMark(schema.marks.italic) as Command
  }
  if (schema.marks.code) {
    bindings['Mod-e'] = toggleMark(schema.marks.code) as Command
  }
  if (schema.marks.underline) {
    bindings['Mod-u'] = toggleMark(schema.marks.underline) as Command
  }
  if (schema.marks.strikethrough) {
    bindings['Mod-Shift-s'] = toggleMark(schema.marks.strikethrough) as Command
  }
  if (schema.marks.subscript) {
    bindings['Mod-,'] = toggleMark(schema.marks.subscript) as Command
  }
  if (schema.marks.superscript) {
    bindings['Mod-.'] = toggleMark(schema.marks.superscript) as Command
  }

  // Headings: Mod-Alt-1~6 (toggle)
  if (schema.nodes.heading && schema.nodes.paragraph) {
    const toggleHeading = (level: number): Command => {
      return (state, dispatch) => {
        const { $from } = state.selection
        const node = $from.parent
        if (node.type.name === 'heading' && node.attrs.level === level) {
          return setBlockType(schema.nodes.paragraph)(state, dispatch)
        }
        return setBlockType(schema.nodes.heading, { level })(state, dispatch)
      }
    }
    for (let i = 1; i <= 6; i++) {
      bindings[`Mod-Alt-${i}`] = toggleHeading(i)
    }
    bindings['Mod-Alt-0'] = setBlockType(schema.nodes.paragraph) as Command
  }

  // Block quote (toggle)
  if (schema.nodes.blockquote) {
    bindings['Mod-Shift-b'] = ((state, dispatch) => {
      const { $from } = state.selection
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type === schema.nodes.blockquote) {
          return lift(state, dispatch)
        }
      }
      return wrapIn(schema.nodes.blockquote)(state, dispatch)
    }) satisfies Command
  }

  // Code block (toggle)
  if (schema.nodes.code_block) {
    bindings['Mod-Shift-c'] = ((state, dispatch) => {
      const { $from } = state.selection
      if ($from.parent.type === schema.nodes.code_block) {
        return setBlockType(schema.nodes.paragraph)(state, dispatch)
      }
      return setBlockType(schema.nodes.code_block)(state, dispatch)
    }) satisfies Command
  }

  // Hard break: Shift-Enter
  if (schema.nodes.hard_break) {
    bindings['Shift-Enter'] = ((state, dispatch) => {
      const { hard_break: hardBreak } = schema.nodes
      const { $from } = state.selection
      if ($from.parent.type.spec.code) {
        if (dispatch) {
          dispatch(state.tr.insertText('\n'))
        }
        return true
      }
      if (dispatch) {
        dispatch(state.tr.replaceSelectionWith(hardBreak.create()).scrollIntoView())
      }
      return true
    }) satisfies Command
  }

  return bindings
}
