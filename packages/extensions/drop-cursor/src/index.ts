import { Extension } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

interface DropCursorOptions {
  color: string
  width: number
}

const DROP_CURSOR_CLASS = 'verso-drop-cursor'

export const DropCursorExtension = Extension.create<DropCursorOptions>({
  name: 'dropCursor',
  defaultOptions: {
    color: '#000',
    width: 2,
  },
  plugins: [
    () => {
      const key = new PluginKey('dropCursor')
      let dropPos: number | null = null
      let decorationSet: DecorationSet = DecorationSet.empty

      return new Plugin({
        key,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, _value, _oldState, newState) {
            if (tr.getMeta(key)) {
              const pos = tr.getMeta(key).pos as number | null
              if (pos === null) {
                dropPos = null
                return DecorationSet.empty
              }
              dropPos = pos
              const widget = Decoration.widget(pos, () => {
                const cursor = document.createElement('div')
                cursor.classList.add(DROP_CURSOR_CLASS)
                cursor.style.cssText = `
                  position: absolute;
                  left: 0;
                  right: 0;
                  height: ${String(2)}px;
                  background-color: #000;
                  pointer-events: none;
                  z-index: 1000;
                `
                return cursor
              })
              return DecorationSet.create(newState.doc, [widget])
            }
            // Map decorations through document changes
            if (dropPos !== null && tr.docChanged) {
              const mapped = tr.mapping.mapResult(dropPos)
              if (mapped.deleted) {
                dropPos = null
                return DecorationSet.empty
              }
              dropPos = mapped.pos
            }
            return decorationSet
          },
        },
        props: {
          decorations(state) {
            decorationSet = key.getState(state) as DecorationSet
            return decorationSet
          },
          handleDrop(view, _event, _slice, _moved) {
            // Clear cursor on drop
            view.dispatch(view.state.tr.setMeta(key, { pos: null }))
            return false
          },
        },
        view() {
          return {
            destroy() {
              dropPos = null
            },
          }
        },
      })
    },
  ],
})
