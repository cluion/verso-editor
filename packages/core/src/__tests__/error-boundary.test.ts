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
})
