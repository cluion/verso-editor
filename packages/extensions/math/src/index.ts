import { NodeExtension } from '@verso-editor/core'
import { InputRule } from 'prosemirror-inputrules'
import type { EditorState, Transaction } from 'prosemirror-state'

export { createMathNodeView } from './math-nodeview'

export const MathExtension = NodeExtension.create({
  name: 'math',
  nodeSpec: {
    group: 'inline',
    inline: true,
    attrs: {
      latex: { default: '' },
      inline: { default: true },
    },
    toDOM: (node) => {
      const attrs: Record<string, string> = {
        'data-type': 'math',
        'data-latex': node.attrs.latex ?? '',
      }
      if (node.attrs.inline) {
        attrs['data-inline'] = 'true'
      }
      return ['span', attrs] as unknown as HTMLElement
    },
    parseDOM: [
      {
        tag: 'span[data-type="math"]',
        getAttrs: (dom) => ({
          latex: (dom as HTMLElement).getAttribute('data-latex') ?? '',
          inline: (dom as HTMLElement).getAttribute('data-inline') === 'true',
        }),
      },
      {
        tag: 'span.katex',
        getAttrs: (dom) => ({
          latex: (dom as HTMLElement).getAttribute('data-latex') ?? '',
          inline: true,
        }),
      },
    ],
  },
  inputRules: () => [
    // Inline math: $...$
    new InputRule(
      /\$([^$]+)\$$/,
      (state: EditorState, match: RegExpMatchArray, start: number, end: number) => {
        const latex = match[1]
        if (!latex) return null

        const mathType = state.schema.nodes.math
        if (!mathType) return null

        const node = mathType.create({ latex, inline: true })
        const { tr }: { tr: Transaction } = state
        return tr.replaceWith(start, end, node)
      },
    ),
    // Block math: $$...$$
    new InputRule(
      /\$\$([^$]+)\$\$$/,
      (state: EditorState, match: RegExpMatchArray, start: number, end: number) => {
        const latex = match[1]
        if (!latex) return null

        const mathType = state.schema.nodes.math
        if (!mathType) return null

        const node = mathType.create({ latex, inline: false })
        const { tr }: { tr: Transaction } = state
        return tr.replaceWith(start, end, node)
      },
    ),
  ],
})
