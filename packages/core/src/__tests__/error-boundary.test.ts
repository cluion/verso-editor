import { Plugin, PluginKey } from 'prosemirror-state'
import { describe, expect, it, vi } from 'vitest'
import { Editor } from '../editor'
import { NodeExtension } from '../extension'

describe('Error Boundary', () => {
  it('calls onError when extension plugin init fails', () => {
    const onError = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const broken = NodeExtension.create({
      name: 'broken',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['div', 0] as unknown as HTMLElement,
      },
      plugins: [
        () => {
          throw new Error('Plugin init failed')
        },
      ],
    })

    // Should not throw, should call onError instead
    const editor = new Editor({ element, extensions: [broken], onError })
    expect(onError).toHaveBeenCalled()
    expect(editor.view).toBeDefined()
    editor.destroy()
  })

  it('calls onError callback with default console.error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const element = document.createElement('div')
    document.body.appendChild(element)

    const broken = NodeExtension.create({
      name: 'broken',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['div', 0] as unknown as HTMLElement,
      },
      plugins: [
        () => {
          throw new Error('Plugin init failed')
        },
      ],
    })

    // No onError provided — should use default console.error
    const editor = new Editor({ element, extensions: [broken] })
    expect(consoleSpy).toHaveBeenCalled()
    editor.destroy()
    consoleSpy.mockRestore()
  })

  it('continues with working extensions when one fails', () => {
    const onError = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const broken = NodeExtension.create({
      name: 'broken',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['div', 0] as unknown as HTMLElement,
      },
      plugins: [
        () => {
          throw new Error('Broken')
        },
      ],
    })

    const working = NodeExtension.create({
      name: 'working',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['div', 0] as unknown as HTMLElement,
      },
    })

    const editor = new Editor({ element, extensions: [broken, working], onError })
    expect(editor.schema.nodes.working).toBeDefined()
    expect(editor.schema.nodes.broken).toBeDefined()
    editor.destroy()
  })

  it('catches errors in plugin view.update', () => {
    const onError = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const errorKey = new PluginKey('errorPlugin')

    const errorPlugin = new Plugin({
      key: errorKey,
      view() {
        return {
          update() {
            throw new Error('view.update crashed')
          },
          destroy() {},
        }
      },
    })

    const ext = NodeExtension.create({
      name: 'test_node',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['div', 0] as unknown as HTMLElement,
      },
    })

    // Editor should be created even with erroring plugin
    const editor = new Editor({
      element,
      extensions: [ext],
      plugins: [errorPlugin],
      onError,
    })

    // setContent triggers state update → view.update may throw
    // Error boundary in setContent/updateState should prevent crash
    expect(() => editor.setContent('<div>Hello</div>')).not.toThrow()

    // Editor should still be functional
    expect(editor.view).toBeDefined()
    editor.destroy()
  })

  it('catches errors in plugin view.destroy', () => {
    const onError = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const errorKey = new PluginKey('destroyPlugin')

    const errorPlugin = new Plugin({
      key: errorKey,
      view() {
        return {
          update() {},
          destroy() {
            throw new Error('view.destroy crashed')
          },
        }
      },
    })

    const ext = NodeExtension.create({
      name: 'test_node',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['div', 0] as unknown as HTMLElement,
      },
    })

    const editor = new Editor({
      element,
      extensions: [ext],
      plugins: [errorPlugin],
      onError,
    })

    // Destroy should not throw
    expect(() => editor.destroy()).not.toThrow()
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'view.destroy crashed',
      }),
    )
  })
})
