import type { I18n } from '@verso-editor/core'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

const dragHandleKey = new PluginKey('versoDragHandle')

const DRAG_MIME = 'application/x-verso-drag'

interface DragHandleState {
  active: boolean
  pos: number | null
  node: ProseMirrorNode | null
  dragging: boolean
  fromPos: number | null
}

interface DragHandleOptions {
  i18n?: I18n
}

/**
 * Create a Drag Handle plugin that provides:
 * - Hover detection to show/hide a drag handle next to block nodes
 * - Drag-and-drop sorting of block nodes via handle drag
 */
export function createDragHandlePlugin(options?: DragHandleOptions): Plugin {
  return new Plugin({
    key: dragHandleKey,
    state: {
      init: (): DragHandleState => ({
        active: false,
        pos: null,
        node: null,
        dragging: false,
        fromPos: null,
      }),
      apply: (tr, value) => {
        const meta = tr.getMeta(dragHandleKey)
        if (meta) return { ...value, ...meta }
        return value
      },
    },
    view(editorView: EditorView) {
      const handle = document.createElement('div')
      handle.classList.add('vs-drag-handle')
      handle.setAttribute('role', 'button')
      handle.setAttribute(
        'aria-label',
        options?.i18n?.t('dragHandle.ariaLabel') ?? 'Drag to move block',
      )
      handle.setAttribute('tabindex', '0')
      handle.setAttribute('draggable', 'true')
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

      // Drag start: record the source position
      handle.addEventListener('dragstart', (e: DragEvent) => {
        const state = dragHandleKey.getState(editorView.state) as DragHandleState
        if (state.pos !== null) {
          e.dataTransfer?.setData(DRAG_MIME, String(state.pos))
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move'
          }

          const tr = editorView.state.tr.setMeta(dragHandleKey, {
            dragging: true,
            fromPos: state.pos,
          })
          editorView.dispatch(tr)
        }
      })

      const offLocaleChange = options?.i18n?.onChange(() => {
        handle.setAttribute(
          'aria-label',
          options?.i18n?.t('dragHandle.ariaLabel') ?? 'Drag to move block',
        )
      })

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
          offLocaleChange?.()
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
      /**
       * Handle drop events to reorder block nodes.
       * When a drag from this plugin is detected, move the source node
       * to the drop target position.
       */
      handleDrop(view, event, _slice, moved) {
        if (!moved) return false

        const dt = (event as DragEvent).dataTransfer
        if (!dt) return false

        const dragData = dt.getData(DRAG_MIME)
        if (!dragData) return false

        const fromPos = Number.parseInt(dragData, 10)
        if (Number.isNaN(fromPos)) return false

        // Calculate drop position from event coordinates
        const dropPos = view.posAtCoords({
          left: (event as DragEvent).clientX,
          top: (event as DragEvent).clientY,
        })

        if (!dropPos) return false

        const $drop = view.state.doc.resolve(dropPos.pos)
        const toNodePos = $drop.before($drop.depth)

        // Don't move to same position
        if (fromPos === toNodePos) return false

        const fromNode = view.state.doc.nodeAt(fromPos)
        if (!fromNode) return false

        // Delete from source, insert at target
        let tr = view.state.tr.delete(fromPos, fromPos + fromNode.nodeSize)

        // Adjust target position if deleting before the target
        const adjustedToPos = fromPos < toNodePos ? toNodePos - fromNode.nodeSize : toNodePos

        tr = tr.insert(adjustedToPos, fromNode)

        view.dispatch(tr)

        // Reset drag state
        const resetTr = view.state.tr.setMeta(dragHandleKey, {
          dragging: false,
          fromPos: null,
        })
        view.dispatch(resetTr)

        event.preventDefault()
        return true
      },
    },
  })
}
