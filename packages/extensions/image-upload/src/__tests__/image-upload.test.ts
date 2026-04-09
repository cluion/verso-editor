import { Schema } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createImageUploadPlugin } from '../index'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['p', 0] as unknown as HTMLElement,
    },
    image: {
      inline: true,
      group: 'inline',
      attrs: { src: { default: '' }, alt: { default: '' } },
      draggable: true,
      toDOM: (node) => ['img', node.attrs] as unknown as HTMLElement,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: (dom) => ({ src: (dom as HTMLElement).getAttribute('src') ?? '' }),
        },
      ],
    },
    text: { group: 'inline' },
  },
})

let views: EditorView[] = []

afterEach(() => {
  for (const v of views) {
    v.destroy()
  }
  views = []
  vi.restoreAllMocks()
})

function createView(plugins: Plugin[] = []): EditorView {
  const element = document.createElement('div')
  document.body.appendChild(element)
  const doc = schema.nodes.doc.create(
    null,
    schema.nodes.paragraph.create(null, schema.text('Test')),
  )
  const view = new EditorView(element, {
    state: EditorState.create({ doc, plugins }),
    dispatchTransaction(tr) {
      const newState = view.state.apply(tr)
      view.updateState(newState)
    },
  })
  views.push(view)
  return view
}

function createFile(name = 'test.png', type = 'image/png', size = 1024): File {
  const content = new ArrayBuffer(size)
  const file = new File([content], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

function createMockDropEvent(files: File[]): DragEvent {
  return {
    dataTransfer: { files: files as unknown as FileList },
    preventDefault: vi.fn(),
  } as unknown as DragEvent
}

function createMockPasteEvent(files: File[]): ClipboardEvent {
  return {
    clipboardData: { files: files as unknown as FileList },
    preventDefault: vi.fn(),
  } as unknown as ClipboardEvent
}

describe('Image Upload Plugin', () => {
  it('creates a plugin instance', () => {
    const upload = vi.fn().mockResolvedValue('https://example.com/image.png')
    const plugin = createImageUploadPlugin({ upload })
    expect(plugin).toBeInstanceOf(Plugin)
  })

  describe('drop event', () => {
    it('triggers upload for dropped image files', async () => {
      const upload = vi.fn().mockResolvedValue('https://example.com/uploaded.png')
      const plugin = createImageUploadPlugin({ upload })
      const view = createView([plugin])

      const file = createFile()
      const event = createMockDropEvent([file])

      // Call handleDrop via plugin props
      const handled = plugin.props?.handleDrop?.(view, event)
      expect(handled).toBe(true)

      await vi.waitFor(() => {
        expect(upload).toHaveBeenCalledWith(file)
      })
    })

    it('inserts image node after successful upload', async () => {
      const src = 'https://example.com/uploaded.png'
      const upload = vi.fn().mockResolvedValue(src)
      const plugin = createImageUploadPlugin({ upload })
      const view = createView([plugin])

      const file = createFile()
      const event = createMockDropEvent([file])

      plugin.props?.handleDrop?.(view, event)

      await vi.waitFor(() => {
        const doc = view.state.doc
        expect(doc.toString()).toContain('image')
      })
    })
  })

  describe('paste event', () => {
    it('triggers upload for pasted image files', async () => {
      const upload = vi.fn().mockResolvedValue('https://example.com/pasted.png')
      const plugin = createImageUploadPlugin({ upload })
      const view = createView([plugin])

      const file = createFile('paste.png', 'image/png')
      const event = createMockPasteEvent([file])

      plugin.props?.handlePaste?.(view, event)

      await vi.waitFor(() => {
        expect(upload).toHaveBeenCalledWith(file)
      })
    })
  })

  describe('file type filtering', () => {
    it('rejects non-image file types by default', async () => {
      const upload = vi.fn().mockResolvedValue('https://example.com/file.pdf')
      const plugin = createImageUploadPlugin({ upload })
      const view = createView([plugin])

      const file = createFile('document.pdf', 'application/pdf')
      const event = createMockDropEvent([file])

      plugin.props?.handleDrop?.(view, event)

      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(upload).not.toHaveBeenCalled()
    })

    it('accepts custom file types via accept option', async () => {
      const upload = vi.fn().mockResolvedValue('https://example.com/file.svg')
      const plugin = createImageUploadPlugin({ upload, accept: ['image/svg+xml'] })
      const view = createView([plugin])

      const file = createFile('diagram.svg', 'image/svg+xml')
      const event = createMockDropEvent([file])

      plugin.props?.handleDrop?.(view, event)

      await vi.waitFor(() => {
        expect(upload).toHaveBeenCalledWith(file)
      })
    })
  })

  describe('file size filtering', () => {
    it('rejects files exceeding maxSize', async () => {
      const upload = vi.fn().mockResolvedValue('https://example.com/big.png')
      const plugin = createImageUploadPlugin({ upload, maxSize: 512 })
      const view = createView([plugin])

      const file = createFile('big.png', 'image/png', 1024)
      const event = createMockDropEvent([file])

      plugin.props?.handleDrop?.(view, event)

      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(upload).not.toHaveBeenCalled()
    })

    it('accepts files within maxSize', async () => {
      const upload = vi.fn().mockResolvedValue('https://example.com/small.png')
      const plugin = createImageUploadPlugin({ upload, maxSize: 2048 })
      const view = createView([plugin])

      const file = createFile('small.png', 'image/png', 1024)
      const event = createMockDropEvent([file])

      plugin.props?.handleDrop?.(view, event)

      await vi.waitFor(() => {
        expect(upload).toHaveBeenCalledWith(file)
      })
    })
  })

  describe('upload failure handling', () => {
    it('handles upload failure gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const upload = vi.fn().mockRejectedValue(new Error('Upload failed'))
      const plugin = createImageUploadPlugin({ upload })
      const view = createView([plugin])

      const file = createFile()
      const event = createMockDropEvent([file])

      plugin.props?.handleDrop?.(view, event)

      await vi.waitFor(() => {
        expect(upload).toHaveBeenCalledWith(file)
      })

      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(consoleError).toHaveBeenCalled()
    })

    it('calls onError callback on upload failure', async () => {
      const onError = vi.fn()
      const uploadError = new Error('Upload failed')
      const upload = vi.fn().mockRejectedValue(uploadError)
      const plugin = createImageUploadPlugin({ upload, onError })
      const view = createView([plugin])

      const file = createFile()
      const event = createMockDropEvent([file])

      plugin.props?.handleDrop?.(view, event)

      await vi.waitFor(() => {
        expect(onError).toHaveBeenCalledWith(uploadError)
      })
    })
  })
})
