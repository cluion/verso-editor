import { NodeExtension } from '@verso-editor/core'

export const HorizontalRuleExtension = NodeExtension.create({
  name: 'horizontal_rule',
  nodeSpec: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM: () => ['hr'] as unknown as HTMLElement,
  },
})
