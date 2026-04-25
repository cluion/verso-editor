import { NodeExtension, type NodeViewFactory } from '@verso-editor/core'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { createTagNodeView } from './tag-nodeview'

export interface TagSuggestionOptions {
  char?: string
  onSuggestion?: (props: TagSuggestionProps) => void
  onClose?: () => void
}

export interface TagSuggestionProps {
  view: EditorView
  range: { from: number; to: number }
  query: string
  text: string
}

export const TagExtension = NodeExtension.create<TagSuggestionOptions>({
  name: 'tag',
  defaultOptions: {
    char: '#',
    onSuggestion: undefined,
    onClose: undefined,
  },
  nodeSpec: {
    inline: true,
    group: 'inline',
    atom: true,
    attrs: {
      id: { default: '' },
      label: { default: '' },
    },
    toDOM: (node) =>
      [
        'span',
        {
          'data-type': 'tag',
          'data-id': node.attrs.id,
          class: 'vs-tag',
        },
        ['span', { class: 'vs-tag__label' }, `#${node.attrs.label}`],
      ] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'span[data-type="tag"]',
        getAttrs: (dom) => ({
          id: (dom as HTMLElement).getAttribute('data-id') ?? '',
          label:
            (dom as HTMLElement).querySelector('.vs-tag__label')?.textContent?.replace(/^#/, '') ??
            '',
        }),
      },
    ],
  },
  nodeView: createTagNodeView() as unknown as NodeViewFactory,
  plugins: [
    () => {
      const key = new PluginKey('tagSuggestion')
      return new Plugin({
        key,
        props: {
          handleKeyDown(view, event) {
            const state = key.getState(view.state) as TagSuggestionOptions | undefined
            if (!state?.onSuggestion) return false

            if (event.key === 'Escape') {
              state.onClose?.()
              return true
            }
            return false
          },
        },
        state: {
          init: () => ({}),
          apply(tr, _value, _oldState, newState) {
            if (!tr.docChanged) return {}

            const $pos = tr.selection.$head
            const textBefore = $pos.parent.textContent.slice(0, $pos.parentOffset)

            const char = '#'
            const match = textBefore.match(new RegExp(`\\${char}([^\\s${char}]*)$`))

            if (match) {
              const from = $pos.pos - match[0].length
              const to = $pos.pos
              const query = match[1]

              const posBeforeMatch = from - 1
              if (posBeforeMatch >= 0 && posBeforeMatch < newState.doc.content.size) {
                const charBefore = newState.doc.textBetween(Math.max(0, posBeforeMatch), from)
                if (charBefore === '' || charBefore === '\n') {
                  return {}
                }
              } else if (from === 1) {
                return {}
              }

              return {
                char,
                onSuggestion: (TagExtension as unknown as { options: TagSuggestionOptions }).options
                  ?.onSuggestion,
                onClose: (TagExtension as unknown as { options: TagSuggestionOptions }).options
                  ?.onClose,
              } satisfies TagSuggestionOptions
            }
            return {}
          },
        },
      })
    },
  ],
})

export function insertTag(id: string, label: string) {
  return (view: EditorView, range: { from: number; to: number }) => {
    const node = view.state.schema.nodes.tag
    if (!node) return false

    const tr = view.state.tr
      .delete(range.from, range.to)
      .insert(range.from, node.create({ id, label }))
    view.dispatch(tr)
    return true
  }
}

export function getTags(editor: { view: EditorView }): Array<{ id: string; label: string }> {
  const tags: Array<{ id: string; label: string }> = []
  const { doc } = editor.view.state

  doc.descendants((node: ProseMirrorNode) => {
    if (node.type.name === 'tag') {
      tags.push({ id: node.attrs.id, label: node.attrs.label })
    }
  })

  return tags
}

export { createTagNodeView }
