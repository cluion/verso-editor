import { Extension } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export type FindReplaceOptions = Record<string, unknown> & {
  onResults?: (count: number) => void
}

export interface SearchResult {
  from: number
  to: number
}

export const FindReplaceExtension = Extension.create<FindReplaceOptions>({
  name: 'findReplace',
  defaultOptions: {
    onResults: undefined,
  } as FindReplaceOptions,
  plugins: [
    () => {
      const key = new PluginKey('findReplace')
      return new Plugin({
        key,
        state: {
          init: () => ({
            query: '',
            caseSensitive: false,
            useRegex: false,
            results: [] as SearchResult[],
          }),
          apply(tr, value) {
            const meta = tr.getMeta(key)
            if (meta) return { ...value, ...meta }
            if (tr.docChanged) {
              const results = findMatches(tr.doc, value.query, value.caseSensitive, value.useRegex)
              FindReplaceExtension.options.onResults?.(results.length)
              return { ...value, results }
            }
            return value
          },
        },
        props: {
          decorations(state) {
            const pluginState = key.getState(state) as
              | {
                  results: SearchResult[]
                }
              | undefined
            if (!pluginState?.results?.length) return DecorationSet.empty

            const decorations = pluginState.results.map((r: SearchResult) =>
              Decoration.inline(r.from, r.to, {
                class: 'verso-find-highlight',
                style: 'background-color: #ffe066; border-radius: 2px;',
              }),
            )
            return DecorationSet.create(state.doc, decorations)
          },
        },
      })
    },
  ],
})

function findMatches(
  doc: import('prosemirror-model').Node,
  query: string,
  caseSensitive: boolean,
  useRegex: boolean,
): SearchResult[] {
  if (!query) return []

  const results: SearchResult[] = []
  const flags = caseSensitive ? 'g' : 'gi'
  let pattern: RegExp

  try {
    pattern = useRegex ? new RegExp(query, flags) : new RegExp(escapeRegex(query), flags)
  } catch {
    return []
  }

  doc.descendants((node, pos) => {
    if (!node.isTextblock) return
    const text = node.textContent
    if (!text) return

    let match: RegExpExecArray | null
    // biome-ignore lint/suspicious/noAssignInExpressions: regex exec loop pattern
    while ((match = pattern.exec(text)) !== null) {
      const from = pos + match.index + 1
      const to = from + match[0].length
      results.push({ from, to })
    }
    pattern.lastIndex = 0
  })

  return results
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
