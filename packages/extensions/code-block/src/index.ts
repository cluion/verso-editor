import { NodeExtension } from '@verso-editor/core'

export { createCodeBlockNodeView } from './codeblock-nodeview'

export const CodeBlockExtension = NodeExtension.create({
  name: 'code_block',
  nodeSpec: {
    content: 'text*',
    group: 'block',
    marks: '',
    attrs: {
      language: { default: '' },
    },
    toDOM: (node) =>
      ['pre', { 'data-language': node.attrs.language }, ['code', 0]] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'pre',
        preserveWhitespace: 'full' as const,
        getAttrs: (dom) => ({
          language: (dom as HTMLElement).getAttribute('data-language') ?? '',
        }),
      },
    ],
  },
})
