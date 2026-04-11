import { Plugin, PluginKey } from 'prosemirror-state'
import { describe, expect, it, vi } from 'vitest'
import { Editor } from '../editor'
import { MarkExtension, NodeExtension } from '../extension'

describe('Editor', () => {
  function createEditor() {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({ element })
    return { editor, element }
  }

  it('creates an editor instance attached to a DOM element', () => {
    const { editor, element } = createEditor()
    expect(editor.view.dom.parentElement).toBe(element)
    editor.destroy()
  })

  it('creates editor with initial content', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({ element, content: '<p>Hello</p>' })
    expect(editor.getHTML()).toContain('Hello')
    editor.destroy()
  })

  it('creates editor with custom ariaLabel', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({ element, ariaLabel: 'My editor' })
    expect(editor.view.dom.getAttribute('aria-label')).toBe('My editor')
    editor.destroy()
  })

  it('defaults ariaLabel to "Rich text editor"', () => {
    const { editor } = createEditor()
    expect(editor.view.dom.getAttribute('aria-label')).toBe('Rich text editor')
    editor.destroy()
  })

  it('setContent sets document content', () => {
    const { editor } = createEditor()
    editor.setContent('<p>Hello <strong>world</strong></p>')
    const html = editor.getHTML()
    expect(html).toContain('Hello')
    expect(html).toContain('world')
    editor.destroy()
  })

  it('setContent strips script tags via sanitization', () => {
    const { editor } = createEditor()
    editor.setContent('<p>Hello</p><script>alert(1)</script>')
    const html = editor.getHTML()
    expect(html).toContain('Hello')
    expect(html).not.toContain('script')
    editor.destroy()
  })

  it('setContent strips event handlers via sanitization', () => {
    const { editor } = createEditor()
    editor.setContent('<p onclick="alert(1)">Hello</p>')
    const html = editor.getHTML()
    expect(html).toContain('Hello')
    expect(html).not.toContain('onclick')
    editor.destroy()
  })

  it('constructor content is sanitized', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({
      element,
      content: '<p>Hi</p><script>alert(1)</script>',
    })
    expect(editor.getHTML()).not.toContain('script')
    editor.destroy()
  })

  it('getJSON returns a valid ProseMirror document', () => {
    const { editor } = createEditor()
    editor.setContent('<p>test</p>')
    const json = editor.getJSON()
    expect(json.type).toBe('doc')
    expect(json.content).toBeDefined()
    editor.destroy()
  })

  it('getHTML returns HTML string', () => {
    const { editor } = createEditor()
    editor.setContent('<p>Hello</p>')
    const html = editor.getHTML()
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
    editor.destroy()
  })

  it('getHTML round-trips with setContent', () => {
    const { editor } = createEditor()
    editor.setContent('<p>Hello <strong>world</strong></p>')
    const html = editor.getHTML()
    expect(html).toContain('<strong>')
    expect(html).toContain('Hello')
    expect(html).toContain('world')
    editor.destroy()
  })

  it('destroy cleans up the editor view', () => {
    const { editor, element } = createEditor()
    const dom = editor.view.dom
    editor.destroy()
    expect(element.contains(dom)).toBe(false)
  })

  it('destroy is idempotent', () => {
    const { editor } = createEditor()
    editor.destroy()
    expect(() => editor.destroy()).not.toThrow()
  })

  it('insertContent inserts content at cursor', () => {
    const { editor } = createEditor()
    editor.setContent('<p></p>')
    editor.insertContent('Inserted text')
    const html = editor.getHTML()
    expect(html).toContain('Inserted text')
    editor.destroy()
  })

  it('insertContent sanitizes HTML', () => {
    const { editor } = createEditor()
    editor.setContent('<p></p>')
    editor.insertContent('<img src="x" onerror="alert(1)">')
    expect(editor.getHTML()).not.toContain('onerror')
    editor.destroy()
  })

  it('supports event subscription via on/off', () => {
    const { editor } = createEditor()
    const handler = vi.fn()
    editor.on('update', handler)
    editor.setContent('<p>trigger</p>')
    expect(handler).toHaveBeenCalled()
    editor.destroy()
  })

  it('stops emitting after off', () => {
    const { editor } = createEditor()
    const handler = vi.fn()
    editor.on('update', handler)
    editor.off('update', handler)
    editor.setContent('<p>trigger</p>')
    expect(handler).not.toHaveBeenCalled()
    editor.destroy()
  })

  it('on and off return this for chaining', () => {
    const { editor } = createEditor()
    const handler = vi.fn()
    const result = editor.on('update', handler)
    expect(result).toBe(editor)
    const offResult = editor.off('update', handler)
    expect(offResult).toBe(editor)
    editor.destroy()
  })

  it('fires focus event', () => {
    const { editor } = createEditor()
    const handler = vi.fn()
    editor.on('focus', handler)
    editor.view.dom.dispatchEvent(new FocusEvent('focus'))
    expect(handler).toHaveBeenCalled()
    editor.destroy()
  })

  it('fires blur event', () => {
    const { editor } = createEditor()
    const handler = vi.fn()
    editor.on('blur', handler)
    editor.view.dom.dispatchEvent(new FocusEvent('blur'))
    expect(handler).toHaveBeenCalled()
    editor.destroy()
  })

  it('calls onError for errors in dispatchTransaction', () => {
    const onError = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({ element, onError })
    // Force an error by destroying the view then trying setContent
    editor.view.destroy()
    editor.setContent('<p>test</p>')
    expect(onError).toHaveBeenCalled()
  })

  it('announce sets text on live region', () => {
    const { editor } = createEditor()
    editor.announce('Test message')
    const liveRegion = editor.view.dom.parentElement?.querySelector('[aria-live]')
    expect(liveRegion?.textContent).toBe('Test message')
    editor.destroy()
  })
})

describe('Editor with extensions', () => {
  it('creates editor with extensions path', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const bold = MarkExtension.create({
      name: 'bold',
      markSpec: {
        parseDOM: [{ tag: 'strong' }],
        toDOM: () => ['strong', 0] as const,
      },
    })

    const editor = new Editor({ element, extensions: [bold] })
    expect(editor.view.dom.parentElement).toBe(element)
    expect(editor.schema.marks.bold).toBeDefined()
    editor.destroy()
  })

  it('extension schema merges with base nodes', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const heading = NodeExtension.create({
      name: 'heading',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        attrs: { level: { default: 1 } },
        toDOM: () => ['h1', 0] as unknown as HTMLElement,
      },
    })

    const editor = new Editor({ element, extensions: [heading] })
    expect(editor.schema.nodes.heading).toBeDefined()
    expect(editor.schema.nodes.paragraph).toBeDefined()
    editor.destroy()
  })

  it('creates editor with extensions and extra plugins', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const plugin = new Plugin({ key: new PluginKey('test-plugin') })
    const bold = MarkExtension.create({
      name: 'bold',
      markSpec: {
        parseDOM: [{ tag: 'strong' }],
        toDOM: () => ['strong', 0] as const,
      },
    })
    const editor = new Editor({ element, extensions: [bold], plugins: [plugin] })
    expect(editor.view.dom.parentElement).toBe(element)
    editor.destroy()
  })
})
