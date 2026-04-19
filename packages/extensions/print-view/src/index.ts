import { Extension } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'

export const PrintViewExtension = Extension.create({
  name: 'printView',
  plugins: [
    () => {
      const key = new PluginKey('printView')
      return new Plugin({
        key,
        props: {
          attributes: { class: 'verso-print-view' },
        },
      })
    },
  ],
  commands: {
    print: () => () => {
      const printStyles = document.createElement('style')
      printStyles.setAttribute('data-verso-print', 'true')
      printStyles.textContent = `
        @media print {
          body > *:not(.verso-print-view) { display: none !important; }
          .verso-print-view { display: block !important; }
          .verso-toolbar, .verso-sidebar, .verso-statusbar { display: none !important; }
          .verso-editor { border: none !important; box-shadow: none !important; }
          .verso-resize-handle { display: none !important; }
          .verso-placeholder { display: none !important; }
          .verso-find-highlight { background: none !important; }
        }
      `
      document.head.appendChild(printStyles)
      globalThis.window?.print()
      setTimeout(() => printStyles.remove(), 1000)
      return true
    },
  },
})
