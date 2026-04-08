import { Editor } from '@verso-editor/core'
import { useEffect, useRef, useState } from 'react'

interface UseEditorOptions {
  extensions?: import('@verso-editor/core').Extension[]
  content?: string
  onError?: (error: Error) => void
}

/**
 * React hook that creates and manages an Editor instance lifecycle.
 * Returns null on first render, then a mounted Editor on subsequent renders.
 */
export function useEditor(options?: UseEditorOptions): Editor | null {
  const [editor, setEditor] = useState<Editor | null>(null)
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const instance = new Editor({
      element: container,
      content: optionsRef.current?.content,
      extensions: optionsRef.current?.extensions,
      onError: optionsRef.current?.onError,
    })

    setEditor(instance)

    return () => {
      instance.destroy()
      container.remove()
    }
  }, [])

  return editor
}

interface EditorContentProps {
  editor: Editor
  className?: string
}

/**
 * React component that renders the editor's ProseMirror DOM into the React tree.
 */
export function EditorContent({ editor, className }: EditorContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    // Move the ProseMirror DOM into the React container
    const editorDom = editor.view.dom
    container.appendChild(editorDom)

    return () => {
      // Return the DOM to its original parent so destroy can clean up
      if (editorDom.parentElement === container) {
        container.removeChild(editorDom)
      }
    }
  }, [editor])

  return <div ref={ref} className={className} />
}
