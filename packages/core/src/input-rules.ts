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
