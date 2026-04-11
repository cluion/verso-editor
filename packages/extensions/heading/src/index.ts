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
    },
    parseDOM: [1, 2, 3, 4, 5, 6].map((level) => ({
      tag: `h${level}`,
      attrs: { level },
    })),
    toDOM: (node) => [`h${node.attrs.level}`, 0] as unknown as HTMLElement,
  },
})
