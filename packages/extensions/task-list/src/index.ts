import { NodeExtension } from '@verso-editor/core'
import { createTaskItemNodeView } from './task-item-nodeview'

export { createTaskItemNodeView } from './task-item-nodeview'

export const TaskListExtension = NodeExtension.create({
  name: 'taskList',
  nodeSpec: {
    content: 'taskItem+',
    group: 'block',
    toDOM: () => ['ul', { 'data-type': 'taskList' }, 0] as unknown as HTMLElement,
    parseDOM: [{ tag: 'ul[data-type="taskList"]' }],
  },
})

export const TaskItemExtension = NodeExtension.create({
  name: 'taskItem',
  nodeSpec: {
    content: 'inline (taskList)?',
    attrs: {
      checked: { default: false },
    },
    toDOM: (node) => {
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = node.attrs.checked as boolean
      return [
        'li',
        { 'data-type': 'taskItem', 'data-checked': String(node.attrs.checked) },
        0,
      ] as unknown as HTMLElement
    },
    parseDOM: [
      {
        tag: 'li[data-type="taskItem"]',
        getAttrs: (dom) => ({
          checked: (dom as HTMLElement).getAttribute('data-checked') === 'true',
        }),
      },
    ],
  },
  nodeView: createTaskItemNodeView(),
})
