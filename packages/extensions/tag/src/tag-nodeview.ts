import type { NodeViewFactory } from '@verso-editor/core'
import type { Node } from 'prosemirror-model'

export function createTagNodeView(): NodeViewFactory {
  return (node: Node) => {
    const container = document.createElement('span')
    container.classList.add('vs-tag')
    container.setAttribute('data-type', 'tag')
    container.setAttribute('data-id', node.attrs.id ?? '')

    const label = document.createElement('span')
    label.classList.add('vs-tag__label')
    label.textContent = `#${node.attrs.label ?? ''}`

    container.appendChild(label)

    return {
      dom: container,

      update(updatedNode: Node) {
        if (updatedNode.type.name !== 'tag') return false
        container.setAttribute('data-id', updatedNode.attrs.id ?? '')
        label.textContent = `#${updatedNode.attrs.label ?? ''}`
        return true
      },

      destroy() {
        container.remove()
      },

      ignoreMutation() {
        return true
      },
    }
  }
}
