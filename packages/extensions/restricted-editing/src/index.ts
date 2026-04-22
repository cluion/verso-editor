import { Extension, MarkExtension } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'

export const EditableMark = MarkExtension.create({
  name: 'editable',
  markSpec: {
    attrs: { class: { default: 'verso-editable' } },
    parseDOM: [{ tag: 'span[data-editable]' }],
    toDOM: () =>
      ['span', { 'data-editable': 'true', class: 'verso-editable' }, 0] as unknown as HTMLElement,
  },
})

export const RestrictedEditingExtension = Extension.create({
  name: 'restrictedEditing',
  plugins: [
    () => {
      const key = new PluginKey('restrictedEditing')
      return new Plugin({
        key,
        filterTransaction(tr, state) {
          if (!tr.docChanged) return true
          const editableType = state.schema.marks.editable
          if (!editableType) return true

          const { from, to } = tr.selection
          if (from === to) return true

          let allowed = true
          const docEnd = state.doc.content.size
          const safeFrom = Math.min(from, docEnd)
          const safeTo = Math.min(to, docEnd)

          try {
            state.doc.nodesBetween(safeFrom, safeTo, (node) => {
              if (!allowed) return false
              if (node.isInline || node.isLeaf) {
                if (node.marks && node.marks.length > 0) {
                  const hasMark = node.marks.some((m) => m.type === editableType)
                  if (!hasMark) {
                    allowed = false
                    return false
                  }
                }
              }
              return true
            })
          } catch {
            return true
          }

          return allowed
        },
      })
    },
  ],
})
