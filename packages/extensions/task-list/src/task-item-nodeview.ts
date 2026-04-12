import type { NodeViewFactory } from '@verso-editor/core'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

export function createTaskItemNodeView(): NodeViewFactory {
  return (node: Node, view: EditorView, getPos: () => number | undefined) => {
    const li = document.createElement('li')
    li.setAttribute('data-type', 'taskItem')
    li.classList.add('verso-task-item')

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = node.attrs.checked as boolean
    checkbox.classList.add('verso-task-item-checkbox')

    const content = document.createElement('span')
    content.classList.add('verso-task-item-content')

    li.appendChild(checkbox)
    li.appendChild(content)

    checkbox.addEventListener('click', (e) => {
      e.preventDefault()
      const pos = getPos()
      if (pos === undefined) return
      const tr = view.state.tr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        checked: !node.attrs.checked,
      })
      view.dispatch(tr)
    })

    return {
      dom: li,
      contentDOM: content,

      update(updatedNode: Node) {
        if (updatedNode.type.name !== 'taskItem') return false
        checkbox.checked = updatedNode.attrs.checked as boolean
        return true
      },

      destroy() {
        checkbox.removeEventListener('click', () => {})
      },

      ignoreMutation() {
        return true
      },
    }
  }
}
