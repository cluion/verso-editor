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
    },
    parseDOM: [1, 2, 3, 4, 5, 6].map((level) => ({
      tag: `h${level}`,
      getAttrs: (dom) => {
        const style = (dom as HTMLElement).getAttribute('style') ?? ''
        const match = style.match(/(?:^|;)\s*text-align:\s*([^;]+)/i)
        return { level, textAlign: match ? match[1].trim() : null }
      },
    })),
    toDOM: (node) => {
      const attrs: Record<string, string> = {}
      const align = node.attrs.textAlign as string | null
      if (align) {
        attrs.style = `text-align: ${align}`
      }
      return [`h${node.attrs.level}`, attrs, 0] as unknown as HTMLElement
    },
  },
})
