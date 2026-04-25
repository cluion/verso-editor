import { NodeExtension, type NodeViewFactory } from '@verso-editor/core'
import { createMermaidNodeView } from './mermaid-nodeview'

export interface MermaidOptions {
  mermaidConfig?: Record<string, unknown>
}

export const MermaidExtension = NodeExtension.create<MermaidOptions>({
  name: 'mermaid',
  defaultOptions: {
    mermaidConfig: undefined,
  },
  nodeSpec: {
    content: 'text*',
    group: 'block',
    marks: '',
    attrs: {
      language: { default: 'mermaid' },
    },
    toDOM: () => ['pre', { 'data-language': 'mermaid' }, ['code', 0]] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'pre[data-language="mermaid"]',
        preserveWhitespace: 'full' as const,
        getAttrs: () => ({ language: 'mermaid' }),
      },
    ],
  },
  nodeView: createMermaidNodeView() as unknown as NodeViewFactory,
})

export { createMermaidNodeView }
