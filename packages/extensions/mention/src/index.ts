import { NodeExtension } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

export interface SuggestionOptions {
  char?: string
  onSuggestion?: (props: SuggestionProps) => void
  onClose?: () => void
}

export interface SuggestionProps {
  view: EditorView
  range: { from: number; to: number }
  query: string
  text: string
}

export const MentionExtension = NodeExtension.create<SuggestionOptions>({
  name: 'mention',
  defaultOptions: {
    char: '@',
    onSuggestion: undefined,
    onClose: undefined,
  },
  nodeSpec: {
    inline: true,
    group: 'inline',
    attrs: {
      id: { default: '' },
      name: { default: '' },
      avatar: { default: '' },
    },
    toDOM: (node) =>
      [
        'span',
        {
          'data-type': 'mention',
          'data-id': node.attrs.id,
          'data-name': node.attrs.name,
          'data-avatar': node.attrs.avatar ?? '',
          class: 'verso-mention',
        },
        `@${node.attrs.name}`,
      ] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'span[data-type="mention"]',
        getAttrs: (dom) => ({
          id: (dom as HTMLElement).getAttribute('data-id') ?? '',
          name: (dom as HTMLElement).getAttribute('data-name') ?? '',
          avatar: (dom as HTMLElement).getAttribute('data-avatar') ?? '',
        }),
      },
    ],
  },
  plugins: [
    () => {
      const key = new PluginKey('mentionSuggestion')
      return new Plugin({
        key,
        props: {
          handleKeyDown(view, event) {
            const options = key.getState(view.state) as SuggestionOptions | undefined
            if (!options?.onSuggestion) return false

            // Close suggestion on Escape
            if (event.key === 'Escape') {
              options.onClose?.()
              return true
            }
            return false
          },
        },
        state: {
          init: () => ({}),
          apply(tr, _value, _oldState, _newState) {
            // Detect @ trigger in text changes
            if (!tr.docChanged) return {}

            const $pos = tr.selection.$head
            const textBefore = $pos.parent.textContent.slice(0, $pos.parentOffset)

            const char = '@'
            const match = textBefore.match(new RegExp(`\\${char}([^\\s${char}]*)$`))

            if (match) {
              const _from = $pos.pos - match[0].length
              const _to = $pos.pos
              const _query = match[1]

              return {
                char,
                onSuggestion: (MentionExtension as unknown as { options: SuggestionOptions })
                  .options?.onSuggestion,
                onClose: (MentionExtension as unknown as { options: SuggestionOptions }).options
                  ?.onClose,
              } satisfies SuggestionOptions & { active: boolean }
            }
            return {}
          },
        },
      })
    },
  ],
})

/**
 * Create a command that inserts a mention node at the given position.
 */
export function createInsertMentionCommand(id: string, name: string, avatar?: string) {
  return (view: EditorView, range: { from: number; to: number }) => {
    const node = view.state.schema.nodes.mention
    if (!node) return false

    const tr = view.state.tr
      .delete(range.from, range.to)
      .insert(range.from, node.create({ id, name, avatar: avatar ?? '' }))
    view.dispatch(tr)
    return true
  }
}
