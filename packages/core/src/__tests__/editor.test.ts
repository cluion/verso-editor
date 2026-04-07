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

  it('setContent sets document content', () => {
    const { editor } = createEditor()
    editor.setContent('<p>Hello <strong>world</strong></p>')
    const html = editor.getHTML()
    expect(html).toContain('Hello')
    expect(html).toContain('world')
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

  it('destroy cleans up the editor view', () => {
    const { editor, element } = createEditor()
    const dom = editor.view.dom
    editor.destroy()
    expect(element.contains(dom)).toBe(false)
  })

  it('insertContent inserts content at cursor', () => {
    const { editor } = createEditor()
    editor.setContent('<p></p>')
    editor.insertContent('Inserted text')
    const html = editor.getHTML()
    expect(html).toContain('Inserted text')
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
})
