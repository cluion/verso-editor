import { Editor } from '@verso-editor/core'

interface CreateEditorStoreOptions {
  element: HTMLElement
  extensions?: import('@verso-editor/core').Extension[]
  content?: string
  onError?: (error: Error) => void
}

export interface EditorStore {
  getEditor(): Editor | null
  onUpdate(handler: (json: Record<string, unknown>) => void): () => void
  destroy(): void
}

/**
 * Svelte-compatible editor store.
 * Create with `createEditorStore({ element })` and use in components:
 *
 * ```svelte
 * <script>
 *   import { createEditorStore } from '@verso-editor/svelte'
 *   let container
 *   const store = createEditorStore({ element: container })
 * </script>
 * <div bind:this={container}></div>
 * ```
 */
export function createEditorStore(options: CreateEditorStoreOptions): EditorStore {
  let editor: Editor | null = new Editor({
    element: options.element,
    content: options.content,
    extensions: options.extensions,
    onError: options.onError,
  })

  return {
    getEditor(): Editor | null {
      return editor
    },

    onUpdate(handler: (json: Record<string, unknown>) => void): () => void {
      editor?.on('update', handler)
      return () => {
        editor?.off('update', handler)
      }
    },

    destroy(): void {
      editor?.destroy()
      editor = null
    },
  }
}
