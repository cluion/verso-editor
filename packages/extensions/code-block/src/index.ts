import { NodeExtension } from '@verso-editor/core'

export const CodeBlockExtension = NodeExtension.create({
  name: 'code_block',
  nodeSpec: {
    content: 'text*',
    group: 'block',
    marks: '',
    toDOM: () => ['pre', ['code', 0]] as unknown as HTMLElement,
  },
})
