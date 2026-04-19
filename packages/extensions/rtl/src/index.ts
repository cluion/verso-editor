import { Extension } from '@verso-editor/core'

export const RtlExtension = Extension.create({
  name: 'rtl',
  commands: {
    toggleDir: () => () => {
      const view = (globalThis as Record<string, unknown>).__versoEditorView as
        | import('prosemirror-view').EditorView
        | undefined
      if (!view) return false

      const { from, to } = view.state.selection
      const tr = view.state.tr

      view.state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.spec.attrs && 'dir' in node.type.spec.attrs) {
          const currentDir = (node.attrs.dir as string) ?? 'auto'
          const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl'
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, dir: nextDir })
        }
      })

      if (tr.docChanged) {
        view.dispatch(tr)
        return true
      }
      return false
    },
  },
  keymap: () => ({
    'Mod-Alt-d': () => {
      const view = (globalThis as Record<string, unknown>).__versoEditorView as
        | import('prosemirror-view').EditorView
        | undefined
      if (!view) return false

      const { from, to } = view.state.selection
      const tr = view.state.tr

      view.state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.spec.attrs && 'dir' in node.type.spec.attrs) {
          const currentDir = (node.attrs.dir as string) ?? 'auto'
          const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl'
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, dir: nextDir })
        }
      })

      if (tr.docChanged) {
        view.dispatch(tr)
        return true
      }
      return false
    },
  }),
})
