import { Extension } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'

export interface OutlineItem {
  level: number
  text: string
  pos: number
  id: string
}

export type OutlineOptions = Record<string, unknown> & {
  onUpdate?: (outline: OutlineItem[]) => void
}

export const OutlineExtension = Extension.create<OutlineOptions>({
  name: 'outline',
  defaultOptions: {
    onUpdate: undefined,
  } as OutlineOptions,
  plugins: [
    () => {
      const key = new PluginKey('outline')
      return new Plugin({
        key,
        state: {
          init: () => [] as OutlineItem[],
          apply(tr, value, _oldState, newState) {
            if (!tr.docChanged) return value
            return getOutline(newState)
          },
        },
        view() {
          return {
            update(view) {
              const outline = key.getState(view.state) as OutlineItem[]
              OutlineExtension.options.onUpdate?.(outline)
            },
          }
        },
      })
    },
  ],
})

export function getOutline(state: import('prosemirror-state').EditorState): OutlineItem[] {
  const items: OutlineItem[] = []
  const headingType = state.schema.nodes.heading
  if (!headingType) return items

  state.doc.descendants((node, pos) => {
    if (node.type === headingType) {
      items.push({
        level: node.attrs.level as number,
        text: node.textContent,
        pos,
        id: `heading-${pos}`,
      })
    }
  })

  return items
}
