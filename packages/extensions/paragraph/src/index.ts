import { NodeExtension } from '@verso-editor/core'

export const ParagraphExtension = NodeExtension.create({
  name: 'paragraph',
  nodeSpec: {
    content: 'inline*',
    group: 'block',
    attrs: {
      textAlign: { default: null as string | null },
    },
    parseDOM: [
      {
        tag: 'p',
        getAttrs: (dom) => {
          const style = (dom as HTMLElement).getAttribute('style') ?? ''
          const match = style.match(/(?:^|;)\s*text-align:\s*([^;]+)/i)
          return match ? { textAlign: match[1].trim() } : { textAlign: null }
        },
      },
    ],
    toDOM: (node) => {
      const align = node.attrs.textAlign as string | null
      if (align) {
        return ['p', { style: `text-align: ${align}` }, 0] as unknown as HTMLElement
      }
      return ['p', 0] as unknown as HTMLElement
    },
  },
})
