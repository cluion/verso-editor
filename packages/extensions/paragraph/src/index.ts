import { NodeExtension } from '@verso-editor/core'

export const ParagraphExtension = NodeExtension.create({
  name: 'paragraph',
  nodeSpec: {
    content: 'inline*',
    group: 'block',
    attrs: {
      textAlign: { default: null as string | null },
      dir: { default: null as string | null },
    },
    parseDOM: [
      {
        tag: 'p',
        getAttrs: (dom) => {
          const el = dom as HTMLElement
          const style = el.getAttribute('style') ?? ''
          const match = style.match(/(?:^|;)\s*text-align:\s*([^;]+)/i)
          const dir = el.getAttribute('dir')
          return {
            textAlign: match ? match[1].trim() : null,
            dir: dir === 'rtl' || dir === 'ltr' || dir === 'auto' ? dir : null,
          }
        },
      },
    ],
    toDOM: (node) => {
      const attrs: Record<string, string> = {}
      const align = node.attrs.textAlign as string | null
      const dir = node.attrs.dir as string | null
      if (align) attrs.style = `text-align: ${align}`
      if (dir) attrs.dir = dir
      if (Object.keys(attrs).length > 0) {
        return ['p', attrs, 0] as unknown as HTMLElement
      }
      return ['p', 0] as unknown as HTMLElement
    },
  },
})
