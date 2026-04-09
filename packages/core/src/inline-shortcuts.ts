import { InputRule, inputRules } from 'prosemirror-inputrules'
import type { MarkType, Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

function markInputRule(
  pattern: RegExp,
  markType: MarkType,
  getAttrs?: (match: RegExpMatchArray) => Record<string, unknown>,
): InputRule {
  return new InputRule(pattern, (state, match, start, end) => {
    const { tr } = state
    const attrs = getAttrs?.(match) ?? undefined

    // match[1] is the text between the delimiters
    const innerText = match[1] ?? match[0].slice(1, -1)

    // Remove the full match and insert the inner text with the mark
    tr.delete(start, end)
    tr.insertText(innerText, start)

    // Apply mark to the inserted text
    const from = start
    const to = start + innerText.length
    tr.addMark(from, to, markType.create(attrs))

    return tr
  })
}

export function createInlineShortcutsPlugin(schema: Schema): Plugin {
  const rules: InputRule[] = []

  // **text** or __text__ → bold
  if (schema.marks.bold) {
    rules.push(markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, schema.marks.bold))
  }

  // `text` → code
  if (schema.marks.code) {
    rules.push(markInputRule(/`([^`]+)`$/, schema.marks.code))
  }

  // *text* or _text_ → italic (must come after bold to avoid conflict)
  if (schema.marks.italic) {
    rules.push(markInputRule(/(?:\*|_)([^*_]+)(?:\*|_)$/, schema.marks.italic))
  }

  const rulesPlugin = inputRules({ rules })

  return new Plugin({
    state: rulesPlugin.spec.state,
    props: rulesPlugin.spec.props,
    view: rulesPlugin.spec.view,
  })
}
