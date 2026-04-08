import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

const dragHandleKey = new PluginKey('versoDragHandle')

interface DragHandleState {
  active: boolean
  pos: number | null
  node: ProseMirrorNode | null
}

export function createDragHandlePlugin(): Plugin {
  return new Plugin({
    key: dragHandleKey,
    state: {
      init: (): DragHandleState => ({ active: false, pos: null, node: null }),
      apply: (tr, value) => {
        const meta = tr.getMeta(dragHandleKey)
        if (meta) return meta
        return value
      },
    },
    view(editorView: EditorView) {
      const handle = document.createElement('div')
      handle.classList.add('vs-drag-handle')
      handle.setAttribute('role', 'button')
      handle.setAttribute('aria-label', 'Drag to move block')
      handle.setAttribute('tabindex', '0')
      handle.style.display = 'none'
      handle.style.position = 'absolute'
      handle.style.cursor = 'grab'
      // Drag handle icon via textContent (safe, no HTML injection)
      const icon = document.createElement('span')
      icon.classList.add('vs-drag-handle__icon')
      icon.textContent = '\u22EE\u22EE'
      handle.appendChild(icon)
      editorView.dom.parentElement?.appendChild(handle)

      function showHandle(view: EditorView, pos: number): void {
        const coords = view.coordsAtPos(pos)
        handle.style.display = 'block'
        handle.style.top = `${coords.top}px`
        handle.style.left = `${coords.left - 30}px`
      }

      function hideHandle(): void {
        handle.style.display = 'none'
      }

      return {
        update(view: EditorView) {
          const state = dragHandleKey.getState(view.state) as DragHandleState
          if (state.active && state.pos !== null) {
            showHandle(view, state.pos)
          } else {
            hideHandle()
          }
        },
        destroy() {
          handle.remove()
        },
      }
    },
    props: {
      handleDOMEvents: {
        mouseover(view, event) {
          const target = event.target as HTMLElement
          if (!target || !view.dom.contains(target)) return false

          const pos = view.posAtDOM(target, 0)
          const $pos = view.state.doc.resolve(pos)
          const nodePos = $pos.before($pos.depth)

          if (nodePos >= 0) {
            const tr = view.state.tr.setMeta(dragHandleKey, {
              active: true,
              pos: nodePos,
              node: view.state.doc.nodeAt(nodePos),
            })
            view.dispatch(tr)
          }
          return false
        },
        mouseleave(view) {
          const tr = view.state.tr.setMeta(dragHandleKey, {
            active: false,
            pos: null,
            node: null,
          })
          view.dispatch(tr)
          return false
        },
      },
    },
  })
}
