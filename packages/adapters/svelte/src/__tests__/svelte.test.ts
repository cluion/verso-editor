import { Editor } from '@verso-editor/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createEditorStore } from '../index'

describe('Svelte Adapter', () => {
  let container: HTMLDivElement | null = null

  afterEach(() => {
    container?.remove()
    container = null
  })

  describe('createEditorStore', () => {
    it('creates editor instance', () => {
      container = document.createElement('div')
      document.body.appendChild(container)

      const store = createEditorStore({ element: container })
      expect(store.getEditor()).toBeInstanceOf(Editor)
      store.destroy()
    })

    it('accepts extensions option', () => {
      container = document.createElement('div')
      document.body.appendChild(container)

      const store = createEditorStore({ element: container, extensions: [] })
      expect(store.getEditor()).toBeInstanceOf(Editor)
      store.destroy()
    })

    it('accepts content option', () => {
      container = document.createElement('div')
      document.body.appendChild(container)

      const store = createEditorStore({
        element: container,
        content: '<p>Hello Svelte</p>',
      })
      expect(store.getEditor()?.getHTML()).toContain('Hello Svelte')
      store.destroy()
    })

    it('destroys editor', () => {
      container = document.createElement('div')
      document.body.appendChild(container)

      const store = createEditorStore({ element: container })
      const destroySpy = vi.spyOn(Editor.prototype, 'destroy')
      store.destroy()
      expect(destroySpy).toHaveBeenCalled()
      destroySpy.mockRestore()
    })

    it('getEditor returns null after destroy', () => {
      container = document.createElement('div')
      document.body.appendChild(container)

      const store = createEditorStore({ element: container })
      store.destroy()
      expect(store.getEditor()).toBeNull()
    })

    it('subscribes to editor updates', () => {
      container = document.createElement('div')
      document.body.appendChild(container)

      const store = createEditorStore({ element: container })
      const handler = vi.fn()
      const unsub = store.onUpdate(handler)

      store.getEditor()?.setContent('<p>Updated</p>')

      expect(handler).toHaveBeenCalled()
      unsub()
      store.destroy()
    })
  })
})
