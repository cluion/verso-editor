import { describe, expect, it, vi } from 'vitest'
import { Editor } from '../editor'

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
