import { NodeExtension } from '@verso-editor/core'

export const HeadingExtension = NodeExtension.create({
  name: 'heading',
  defaultOptions: {
    levels: [1, 2, 3, 4, 5, 6] as number[],
  },
  nodeSpec: {
    content: 'inline*',
    group: 'block',
    attrs: {
      level: { default: 1, validate: 'number' as const },
      textAlign: { default: null as string | null },
      dir: { default: null as string | null },
    },
    parseDOM: [1, 2, 3, 4, 5, 6].map((level) => ({
      tag: `h${level}`,
      getAttrs: (dom) => {
        const el = dom as HTMLElement
        const style = el.getAttribute('style') ?? ''
        const match = style.match(/(?:^|;)\s*text-align:\s*([^;]+)/i)
        const dir = el.getAttribute('dir')
        return {
          level,
          textAlign: match ? match[1].trim() : null,
          dir: dir === 'rtl' || dir === 'ltr' || dir === 'auto' ? dir : null,
        }
      },
    })),
    toDOM: (node) => {
      const attrs: Record<string, string> = {}
      const align = node.attrs.textAlign as string | null
      const dir = node.attrs.dir as string | null
      if (align) attrs.style = `text-align: ${align}`
      if (dir) attrs.dir = dir
      if (Object.keys(attrs).length > 0) {
        return [`h${node.attrs.level}`, attrs, 0] as unknown as HTMLElement
      }
      return [`h${node.attrs.level}`, 0] as unknown as HTMLElement
    },
  },
})
