import type { NodeViewFactory } from '@verso-editor/core'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

/**
 * Create an Image NodeView with resize handles.
 * Wraps the <img> in a container with corner resize handles
 * that update the node's width/height attributes on drag.
 */
export function createImageNodeView(): NodeViewFactory {
  return (node: Node, view: EditorView, getPos: () => number | undefined) => {
    const wrapper = document.createElement('span')
    wrapper.classList.add('verso-image-wrapper')

    const img = document.createElement('img')
    img.setAttribute('src', node.attrs.src ?? '')
    if (node.attrs.alt) img.setAttribute('alt', node.attrs.alt)
    if (node.attrs.title) img.setAttribute('title', node.attrs.title)
    if (node.attrs.width) img.setAttribute('width', String(node.attrs.width))
    if (node.attrs.height) img.setAttribute('height', String(node.attrs.height))

    wrapper.appendChild(img)

    // Create corner resize handles
    const handlePositions = ['nw', 'ne', 'sw', 'se'] as const
    const handles: HTMLElement[] = []

    for (const pos of handlePositions) {
      const handle = document.createElement('span')
      handle.classList.add('verso-resize-handle', `verso-resize-${pos}`)
      wrapper.appendChild(handle)
      handles.push(handle)
    }

    // Resize state
    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0

    function onMouseDown(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()

      startX = e.clientX
      startY = e.clientY
      startWidth = img.width || img.naturalWidth || 100
      startHeight = img.height || img.naturalHeight || 100

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    function onMouseMove(e: MouseEvent) {
      const pos = getPos()
      if (pos === undefined) return

      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const newWidth = Math.max(20, startWidth + dx)
      const newHeight = Math.max(20, startHeight + dy)

      img.setAttribute('width', String(Math.round(newWidth)))
      img.setAttribute('height', String(Math.round(newHeight)))

      const tr = view.state.tr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      })
      view.dispatch(tr)
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    for (const handle of handles) {
      handle.addEventListener('mousedown', onMouseDown)
    }

    return {
      dom: wrapper,

      update(updatedNode: Node) {
        if (updatedNode.type.name !== 'image') return false

        const src = updatedNode.attrs.src ?? ''
        if (img.getAttribute('src') !== src) {
          img.setAttribute('src', src)
        }
        if (updatedNode.attrs.alt) img.setAttribute('alt', updatedNode.attrs.alt)
        else img.removeAttribute('alt')
        if (updatedNode.attrs.title) img.setAttribute('title', updatedNode.attrs.title)
        else img.removeAttribute('title')
        if (updatedNode.attrs.width) img.setAttribute('width', String(updatedNode.attrs.width))
        if (updatedNode.attrs.height) img.setAttribute('height', String(updatedNode.attrs.height))

        return true
      },

      selectNode() {
        wrapper.classList.add('verso-image--selected')
      },

      deselectNode() {
        wrapper.classList.remove('verso-image--selected')
      },

      destroy() {
        for (const handle of handles) {
          handle.removeEventListener('mousedown', onMouseDown)
        }
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      },

      ignoreMutation() {
        return true
      },
    }
  }
}
