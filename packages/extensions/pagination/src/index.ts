import { Extension } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

interface PaginationOptions {
  pageHeight: number
  pageWidth: number
  mode: 'paginated' | 'continuous'
}

export const PaginationExtension = Extension.create<PaginationOptions>({
  name: 'pagination',
  defaultOptions: {
    pageHeight: 1123,
    pageWidth: 796,
    mode: 'continuous',
  },
  plugins: [
    () => {
      const key = new PluginKey('pagination')
      return new Plugin({
        key,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, prev) {
            if (!tr.docChanged) return prev
            return buildPageBreaks(tr.doc, { mode: 'continuous' })
          },
        },
        props: {
          decorations(state) {
            return key.getState(state)
          },
        },
      })
    },
  ],
})

function buildPageBreaks(
  doc: { content: { size: number } },
  options: PaginationOptions,
): DecorationSet {
  if (options.mode !== 'paginated') return DecorationSet.empty
  const decorations: Decoration[] = []
  const pageSize = options.pageHeight
  const docSize = doc.content.size
  for (let pos = pageSize; pos < docSize; pos += pageSize) {
    const widget = document.createElement('div')
    widget.className = 'verso-page-break'
    decorations.push(Decoration.widget(pos, widget))
  }
  return DecorationSet.create(doc as never, decorations)
}

export function setPaginationMode(mode: 'paginated' | 'continuous') {
  return (state: { tr: unknown }) => {
    const tr = state.tr as { setMeta: (key: unknown, value: unknown) => unknown }
    tr.setMeta('pagination', { mode })
    return true
  }
}
