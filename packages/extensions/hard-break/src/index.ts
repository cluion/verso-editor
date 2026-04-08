import { NodeExtension } from '@verso-editor/core'

export const HardBreakExtension = NodeExtension.create({
  name: 'hard_break',
  nodeSpec: {
    inline: true,
    group: 'inline',
    selectable: false,
    toDOM: () => ['br'] as unknown as HTMLElement,
  },
})
