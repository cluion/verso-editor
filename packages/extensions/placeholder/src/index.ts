import { Extension } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

interface PlaceholderOptions {
  placeholder: string
  showOnlyCurrent: boolean
  includeChildren: boolean
}

export const PlaceholderExtension = Extension.create<PlaceholderOptions>({
  name: 'placeholder',
  defaultOptions: {
    placeholder: 'Start typing...',
    showOnlyCurrent: false,
    includeChildren: false,
  },
  plugins: [
    () => {
      const key = new PluginKey('placeholder')

      function createPlaceholderDecoration(text: string): HTMLElement {
        const placeholder = document.createElement('span')
        placeholder.classList.add('verso-placeholder')
        placeholder.style.cssText = `
          color: #adb5bd;
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
        `
        placeholder.textContent = text
        return placeholder
      }

      function buildDecorations(
        state: {
          doc: import('prosemirror-model').Node
          selection: import('prosemirror-state').Selection
        },
        options: PlaceholderOptions,
      ): DecorationSet {
        const decorations: Decoration[] = []

        state.doc.descendants((node, pos) => {
          if (!node.isBlock) return

          // Only show placeholder on empty paragraphs or empty block nodes
          if (node.content.size > 0) return

          const anchor = state.selection.anchor

          // If showOnlyCurrent, only show for the selected empty block
          if (options.showOnlyCurrent) {
            const nodeStart = pos
            const nodeEnd = pos + node.nodeSize
            if (anchor < nodeStart || anchor > nodeEnd) return
          }

          decorations.push(
            Decoration.widget(pos + 1, () => createPlaceholderDecoration(options.placeholder)),
          )
        })

        return DecorationSet.create(state.doc, decorations)
      }

      return new Plugin({
        key,
        state: {
          init: (_config, state) =>
            buildDecorations(state, PlaceholderExtension.options as PlaceholderOptions),
          apply(tr, _value, _oldState, newState) {
            if (tr.docChanged || tr.selectionSet) {
              return buildDecorations(newState, PlaceholderExtension.options as PlaceholderOptions)
            }
            return key.getState(newState) as DecorationSet
          },
        },
        props: {
          decorations(state) {
            return key.getState(state) as DecorationSet
          },
        },
      })
    },
  ],
})
