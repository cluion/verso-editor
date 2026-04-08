import { Editor } from '@verso-editor/core'
import type { ComponentPublicInstance } from 'vue'
import { defineComponent, h, onBeforeUnmount, ref } from 'vue'

interface UseEditorOptions {
  extensions?: import('@verso-editor/core').Extension[]
  content?: string
  onError?: (error: Error) => void
}

/**
 * Vue 3 composable that creates and manages an Editor instance lifecycle.
 */
export function useEditor(options?: UseEditorOptions) {
  const editor = ref<Editor | null>(null)

  const container = document.createElement('div')
  document.body.appendChild(container)

  const instance = new Editor({
    element: container,
    content: options?.content,
    extensions: options?.extensions,
    onError: options?.onError,
  })

  editor.value = instance

  onBeforeUnmount(() => {
    instance.destroy()
    container.remove()
  })

  return editor
}

/**
 * Vue component that renders the editor's ProseMirror DOM.
 */
export const EditorContent = defineComponent({
  name: 'EditorContent',
  props: {
    editor: {
      type: Object as () => Editor,
      required: true,
    },
  },
  setup(props) {
    const containerRef = ref<HTMLDivElement | null>(null)

    return () => {
      const editor = props.editor
      return h('div', {
        ref: (el: Element | ComponentPublicInstance | null) => {
          const div = el as HTMLDivElement | null
          if (div && editor && !div.contains(editor.view.dom)) {
            div.appendChild(editor.view.dom)
          }
          containerRef.value = div
        },
      })
    }
  },
})
