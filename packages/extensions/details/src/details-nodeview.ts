import type { NodeViewFactory } from '@verso-editor/core'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

export function createDetailsNodeView(): NodeViewFactory {
  return (node: Node, view: EditorView, getPos: () => number | undefined) => {
    const dom = document.createElement('details')
    dom.setAttribute('data-type', 'details')
    dom.classList.add('verso-details')
    if (node.attrs.open) {
      dom.setAttribute('open', '')
    }

    const summary = document.createElement('summary')
    summary.classList.add('verso-details-summary')

    const content = document.createElement('div')
    content.classList.add('verso-details-content')

    dom.appendChild(summary)
    dom.appendChild(content)

    summary.addEventListener('click', (e) => {
      e.preventDefault()
      const pos = getPos()
      if (pos === undefined) return

      const currentOpen = node.attrs.open
      const tr = view.state.tr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        open: !currentOpen,
      })
      view.dispatch(tr)
    })

    return {
      dom,
      contentDOM: content,
      update(updatedNode: Node) {
        if (updatedNode.type.name !== 'details') return false
        if (updatedNode.attrs.open) {
          dom.setAttribute('open', '')
        } else {
          dom.removeAttribute('open')
        }
        return true
      },
      ignoreMutation() {
        return false
      },
    }
  }
}
