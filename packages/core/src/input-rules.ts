import {
  InputRule,
  inputRules,
  textblockTypeInputRule,
  wrappingInputRule,
} from 'prosemirror-inputrules'
import type { Schema } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

const key = new PluginKey('inputRules')

export { key as inputRulesPluginKey }

export function createInputRulesPlugin(schema: Schema): Plugin {
  const rules: InputRule[] = []

  // --- Inline mark rules ---

  // **text** → bold
  if (schema.marks.bold) {
    rules.push(markInputRule(/\*\*(.+)\*\*$/, schema.marks.bold))
  }

  // *text* → italic (must come after bold rule)
  if (schema.marks.italic) {
    rules.push(markInputRule(/\*(.+)\*$/, schema.marks.italic))
  }

  // `text` → inline code
  if (schema.marks.code) {
    rules.push(markInputRule(/`(.+)`$/, schema.marks.code))
  }

  // --- Block rules ---

  // # → heading (h1-h6)
  if (schema.nodes.heading) {
    rules.push(
      textblockTypeInputRule(/^(#{1,6})\s$/, schema.nodes.heading, (match) => ({
        level: match[1].length,
      })),
    )
  }

  // > → blockquote
  if (schema.nodes.blockquote) {
    rules.push(wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote))
  }

  // ``` → code block
  if (schema.nodes.code_block) {
    rules.push(textblockTypeInputRule(/^```$/, schema.nodes.code_block))
  }

  // --- or *** → horizontal rule
  if (schema.nodes.horizontal_rule) {
    rules.push(
      new InputRule(/^---$/, (state, _match, start, end) => {
        const { horizontal_rule, paragraph } = schema.nodes
        return state.tr
          .replaceWith(start, end, [horizontal_rule.create(), paragraph.create()])
          .scrollIntoView()
      }),
    )
  }

  // - or * → bullet list
  if (schema.nodes.bullet_list) {
    rules.push(wrappingInputRule(/^\s*[-*+]\s$/, schema.nodes.bullet_list))
  }

  // 1. → ordered list
  if (schema.nodes.ordered_list) {
    rules.push(
      wrappingInputRule(
        /^\s*(\d+)\.\s$/,
        schema.nodes.ordered_list,
        (match) => ({ order: Number(match[1]) }),
        (match, node) => node.childCount + node.attrs.order === Number(match[1]),
      ),
    )
  }

  const rulesPlugin = inputRules({ rules })

  return new Plugin({
    key,
    state: rulesPlugin.spec.state,
    props: rulesPlugin.spec.props,
    view: rulesPlugin.spec.view,
  })
}

/**
 * Create an InputRule that wraps matched text with a mark.
 * e.g. typing `*hello*` applies italic to "hello" and removes the asterisks.
 */
function markInputRule(pattern: RegExp, markType: Schema['marks'][string]): InputRule {
  return new InputRule(pattern, (state, match, start, end) => {
    const text = match[1]
    const from = start + match[0].indexOf(text)
    const to = from + text.length

    const tr = state.tr
    // Remove the delimiter characters
    tr.delete(to, end)
    tr.delete(start, from)
    // Apply the mark to the text
    tr.addMark(start, start + text.length, markType.create())
    return tr
  })
}
