import { cleanup, render } from '@testing-library/react'
import { Editor } from '@verso-editor/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EditorContent, useEditor } from '../index'

afterEach(() => {
  cleanup()
})

describe('React Adapter', () => {
  describe('useEditor', () => {
    it('returns null on first render then editor on re-render', () => {
      const states: (Editor | null)[] = []
      function TestComponent() {
        const editor = useEditor()
        states.push(editor)
        return null
      }
      render(<TestComponent />)
      // First render returns null, second render (after effect) returns Editor
      expect(states[0]).toBeNull()
      expect(states.at(-1)).toBeInstanceOf(Editor)
    })

    it('creates editor instance on mount', () => {
      let editorRef: Editor | null = null
      function TestComponent() {
        const editor = useEditor()
        editorRef = editor
        return editor ? <EditorContent editor={editor} /> : null
      }
      render(<TestComponent />)
      expect(editorRef).toBeInstanceOf(Editor)
      editorRef?.destroy()
    })

    it('destroys editor on unmount', () => {
      const destroySpy = vi.spyOn(Editor.prototype, 'destroy')
      function TestComponent() {
        const editor = useEditor()
        return editor ? <EditorContent editor={editor} /> : null
      }
      const { unmount } = render(<TestComponent />)
      unmount()
      expect(destroySpy).toHaveBeenCalled()
      destroySpy.mockRestore()
    })

    it('accepts extensions option', () => {
      let editorRef: Editor | null = null
      function TestComponent() {
        const editor = useEditor({ extensions: [] })
        editorRef = editor
        return editor ? <EditorContent editor={editor} /> : null
      }
      render(<TestComponent />)
      expect(editorRef).toBeInstanceOf(Editor)
      editorRef?.destroy()
    })

    it('accepts content option', () => {
      let editorRef: Editor | null = null
      function TestComponent() {
        const editor = useEditor({ content: '<p>Hello</p>' })
        editorRef = editor
        return editor ? <EditorContent editor={editor} /> : null
      }
      render(<TestComponent />)
      expect(editorRef).toBeInstanceOf(Editor)
      expect(editorRef?.getHTML()).toContain('Hello')
      editorRef?.destroy()
    })
  })

  describe('EditorContent', () => {
    it('renders editor DOM element', () => {
      function TestComponent() {
        const editor = useEditor()
        return editor ? <EditorContent editor={editor} /> : null
      }
      const { container } = render(<TestComponent />)
      const editorEl = container.querySelector('.ProseMirror')
      expect(editorEl).not.toBeNull()
    })

    it('applies className to wrapper', () => {
      function TestComponent() {
        const editor = useEditor()
        return editor ? <EditorContent editor={editor} className="my-editor" /> : null
      }
      const { container } = render(<TestComponent />)
      expect(container.querySelector('.my-editor')).not.toBeNull()
    })
  })
})
