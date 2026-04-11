import { describe, expect, it } from 'vitest'
import { Editor } from '../editor'

describe('HTML serialization edge cases', () => {
  function createEditor(content?: string) {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({ element, content })
    return { editor, element }
  }

  it('round-trips plain text paragraph', () => {
    const { editor } = createEditor()
    editor.setContent('<p>Hello world</p>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toBe(html)
    editor.destroy()
  })

  it('round-trips nested marks (bold + italic)', () => {
    const { editor } = createEditor()
    editor.setContent('<p><em><strong>bold italic</strong></em></p>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('bold italic')
    expect(editor.getHTML()).toContain('<strong>')
    expect(editor.getHTML()).toContain('<em>')
    editor.destroy()
  })

  it('round-trips heading', () => {
    const { editor } = createEditor()
    editor.setContent('<h2>Heading 2</h2>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('<h2>')
    expect(editor.getHTML()).toContain('Heading 2')
    editor.destroy()
  })

  it('round-trips blockquote', () => {
    const { editor } = createEditor()
    editor.setContent('<blockquote><p>quoted text</p></blockquote>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('<blockquote>')
    expect(editor.getHTML()).toContain('quoted text')
    editor.destroy()
  })

  it('round-trips code block', () => {
    const { editor } = createEditor()
    editor.setContent('<pre><code>const x = 1;</code></pre>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('const x = 1;')
    editor.destroy()
  })

  it('round-trips bullet list', () => {
    const { editor } = createEditor()
    editor.setContent('<ul><li><p>item 1</p></li><li><p>item 2</p></li></ul>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('item 1')
    expect(editor.getHTML()).toContain('item 2')
    expect(editor.getHTML()).toContain('<ul>')
    expect(editor.getHTML()).toContain('<li>')
    editor.destroy()
  })

  it('round-trips ordered list', () => {
    const { editor } = createEditor()
    editor.setContent('<ol><li><p>first</p></li><li><p>second</p></li></ol>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('first')
    expect(editor.getHTML()).toContain('<ol')
    editor.destroy()
  })

  it('round-trips link', () => {
    const { editor } = createEditor()
    editor.setContent('<p><a href="https://example.com">link text</a></p>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('href="https://example.com"')
    expect(editor.getHTML()).toContain('link text')
    editor.destroy()
  })

  it('round-trips horizontal rule', () => {
    const { editor } = createEditor()
    editor.setContent('<p>before</p><hr><p>after</p>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('<hr>')
    expect(editor.getHTML()).toContain('before')
    expect(editor.getHTML()).toContain('after')
    editor.destroy()
  })

  it('round-trips inline code', () => {
    const { editor } = createEditor()
    editor.setContent('<p><code>inline code</code></p>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('<code>inline code</code>')
    editor.destroy()
  })

  it('handles empty document', () => {
    const { editor } = createEditor()
    const html = editor.getHTML()
    expect(html.length).toBeGreaterThan(0)
    editor.destroy()
  })

  it('handles multiple paragraphs', () => {
    const { editor } = createEditor()
    editor.setContent('<p>one</p><p>two</p><p>three</p>')
    const html = editor.getHTML()
    editor.setContent(html)
    expect(editor.getHTML()).toContain('one')
    expect(editor.getHTML()).toContain('two')
    expect(editor.getHTML()).toContain('three')
    editor.destroy()
  })

  it('strips unknown tags but keeps text content', () => {
    const { editor } = createEditor()
    editor.setContent('<p><span>styled</span> text</p>')
    const html = editor.getHTML()
    expect(html).toContain('styled')
    expect(html).toContain('text')
    editor.destroy()
  })
})

describe('JSON serialization edge cases', () => {
  function createEditor(content?: string) {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({ element, content })
    return { editor, element }
  }

  it('getJSON returns doc type with content', () => {
    const { editor } = createEditor()
    editor.setContent('<p>Hello</p>')
    const json = editor.getJSON()
    expect(json.type).toBe('doc')
    expect(Array.isArray(json.content)).toBe(true)
    expect(json.content.length).toBeGreaterThan(0)
    editor.destroy()
  })

  it('getJSON preserves heading level', () => {
    const { editor } = createEditor()
    editor.setContent('<h3>Heading</h3>')
    const json = editor.getJSON()
    const heading = (json.content as Record<string, unknown>[])[0]
    expect((heading as Record<string, unknown>).type).toBe('heading')
    const attrs = (heading as Record<string, unknown>).attrs as { level: number }
    expect(attrs.level).toBe(3)
    editor.destroy()
  })

  it('getJSON preserves marks on text', () => {
    const { editor } = createEditor()
    editor.setContent('<p><strong>bold</strong></p>')
    const json = editor.getJSON()
    const para = (json.content as Record<string, unknown>[])[0]
    const paraContent = (para as Record<string, unknown>).content as Record<string, unknown>[]
    const textNode = paraContent[0]
    const marks = (textNode as Record<string, unknown>).marks as Record<string, unknown>[]
    expect(marks).toBeDefined()
    expect(marks[0].type).toBe('bold')
    editor.destroy()
  })

  it('getJSON preserves link attributes', () => {
    const { editor } = createEditor()
    editor.setContent('<p><a href="https://example.com">link</a></p>')
    const json = editor.getJSON()
    const para = (json.content as Record<string, unknown>[])[0]
    const paraContent = (para as Record<string, unknown>).content as Record<string, unknown>[]
    const textNode = paraContent[0]
    const marks = (textNode as Record<string, unknown>).marks as Record<string, unknown>[]
    const linkMark = marks.find((m) => m.type === 'link')
    const attrs = linkMark?.attrs as { href: string }
    expect(attrs.href).toBe('https://example.com')
    editor.destroy()
  })

  it('getJSON for empty doc has paragraph', () => {
    const { editor } = createEditor()
    const json = editor.getJSON()
    expect(json.type).toBe('doc')
    const content = json.content as Record<string, unknown>[]
    expect(content.length).toBeGreaterThan(0)
    expect(content[0].type).toBe('paragraph')
    editor.destroy()
  })
})
