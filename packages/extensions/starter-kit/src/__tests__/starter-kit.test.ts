import { Editor, MarkExtension } from '@verso-editor/core'
import { BlockquoteExtension } from '@verso-editor/extension-blockquote'
import { BoldExtension } from '@verso-editor/extension-bold'
import { BulletListExtension } from '@verso-editor/extension-bullet-list'
import { CodeExtension } from '@verso-editor/extension-code'
import { CodeBlockExtension } from '@verso-editor/extension-code-block'
import { HardBreakExtension } from '@verso-editor/extension-hard-break'
import { HeadingExtension } from '@verso-editor/extension-heading'
import { HistoryExtension } from '@verso-editor/extension-history'
import { HorizontalRuleExtension } from '@verso-editor/extension-horizontal-rule'
import { ItalicExtension } from '@verso-editor/extension-italic'
import { LinkExtension } from '@verso-editor/extension-link'
import { ListItemExtension } from '@verso-editor/extension-list-item'
import { OrderedListExtension } from '@verso-editor/extension-ordered-list'
import { ParagraphExtension } from '@verso-editor/extension-paragraph'
import { describe, expect, it } from 'vitest'
import { createStarterKit } from '../index'

describe('createStarterKit', () => {
  it('returns all 25 extensions by default', () => {
    const extensions = createStarterKit()
    expect(extensions.length).toBe(25)
  })

  it('excludes extension when set to false', () => {
    const extensions = createStarterKit({ heading: false })
    expect(extensions.length).toBe(24)
    expect(extensions.find((e) => e.name === 'heading')).toBeUndefined()
  })

  it('excludes multiple extensions', () => {
    const extensions = createStarterKit({ heading: false, link: false, history: false })
    expect(extensions.length).toBe(22)
  })

  it('replaces extension with custom one', () => {
    const customBold = MarkExtension.create({
      name: 'bold',
      markSpec: {
        parseDOM: [{ tag: 'b' }],
        toDOM: () => ['b', 0] as const,
      },
    })
    const extensions = createStarterKit({ bold: customBold })
    expect(extensions.length).toBe(25)
    const boldExt = extensions.find((e) => e.name === 'bold')
    expect(boldExt).toBe(customBold)
  })

  it('all extensions have correct names', () => {
    const extensions = createStarterKit()
    const names = extensions.map((e) => e.name)
    expect(names).toContain('bold')
    expect(names).toContain('italic')
    expect(names).toContain('code')
    expect(names).toContain('paragraph')
    expect(names).toContain('heading')
    expect(names).toContain('blockquote')
    expect(names).toContain('horizontal_rule')
    expect(names).toContain('code_block')
    expect(names).toContain('list_item')
    expect(names).toContain('bullet_list')
    expect(names).toContain('ordered_list')
    expect(names).toContain('link')
    expect(names).toContain('hard_break')
    expect(names).toContain('history')
  })
})

describe('Extension nodeSpec/markSpec', () => {
  it('BoldExtension has markSpec with strong and b parseDOM', () => {
    expect(BoldExtension.name).toBe('bold')
    expect(BoldExtension.markSpec).toBeDefined()
    expect(BoldExtension.markSpec?.parseDOM).toHaveLength(2)
  })

  it('ItalicExtension has markSpec with em and i parseDOM', () => {
    expect(ItalicExtension.name).toBe('italic')
    expect(ItalicExtension.markSpec).toBeDefined()
    expect(ItalicExtension.markSpec?.parseDOM).toHaveLength(2)
  })

  it('CodeExtension has markSpec with code parseDOM', () => {
    expect(CodeExtension.name).toBe('code')
    expect(CodeExtension.markSpec).toBeDefined()
    expect(CodeExtension.markSpec?.parseDOM).toHaveLength(1)
  })

  it('ParagraphExtension has nodeSpec with inline content', () => {
    expect(ParagraphExtension.name).toBe('paragraph')
    expect(ParagraphExtension.nodeSpec).toBeDefined()
    expect(ParagraphExtension.nodeSpec?.content).toBe('inline*')
  })

  it('HeadingExtension has nodeSpec with level attribute', () => {
    expect(HeadingExtension.name).toBe('heading')
    expect(HeadingExtension.nodeSpec).toBeDefined()
    const attrs = HeadingExtension.nodeSpec?.attrs as Record<string, unknown>
    expect(attrs.level).toBeDefined()
  })

  it('BlockquoteExtension has nodeSpec with block+ content', () => {
    expect(BlockquoteExtension.name).toBe('blockquote')
    expect(BlockquoteExtension.nodeSpec).toBeDefined()
    expect(BlockquoteExtension.nodeSpec?.content).toBe('block+')
  })

  it('HorizontalRuleExtension has nodeSpec', () => {
    expect(HorizontalRuleExtension.name).toBe('horizontal_rule')
    expect(HorizontalRuleExtension.nodeSpec).toBeDefined()
  })

  it('CodeBlockExtension has nodeSpec with language attr and no marks', () => {
    expect(CodeBlockExtension.name).toBe('code_block')
    expect(CodeBlockExtension.nodeSpec).toBeDefined()
    const attrs = CodeBlockExtension.nodeSpec?.attrs as Record<string, unknown>
    expect(attrs.language).toBeDefined()
    expect(CodeBlockExtension.nodeSpec?.marks).toBe('')
  })

  it('ListItemExtension has nodeSpec', () => {
    expect(ListItemExtension.name).toBe('list_item')
    expect(ListItemExtension.nodeSpec).toBeDefined()
  })

  it('BulletListExtension has nodeSpec with listItem+ content', () => {
    expect(BulletListExtension.name).toBe('bullet_list')
    expect(BulletListExtension.nodeSpec).toBeDefined()
    expect(BulletListExtension.nodeSpec?.content).toBe('listItem+')
  })

  it('OrderedListExtension has nodeSpec with order attr', () => {
    expect(OrderedListExtension.name).toBe('ordered_list')
    expect(OrderedListExtension.nodeSpec).toBeDefined()
    const attrs = OrderedListExtension.nodeSpec?.attrs as Record<string, unknown>
    expect(attrs.order).toBeDefined()
  })

  it('LinkExtension has markSpec with href attr and XSS protection', () => {
    expect(LinkExtension.name).toBe('link')
    expect(LinkExtension.markSpec).toBeDefined()
    const attrs = LinkExtension.markSpec?.attrs as Record<string, unknown>
    expect(attrs.href).toBeDefined()
    const rule = LinkExtension.markSpec?.parseDOM?.[0] as {
      getAttrs: (dom: HTMLElement) => unknown
    }
    const el = document.createElement('a')
    el.setAttribute('href', 'javascript:alert(1)')
    expect(rule.getAttrs?.(el)).toBe(false)
  })

  it('HardBreakExtension has nodeSpec that is inline and not selectable', () => {
    expect(HardBreakExtension.name).toBe('hard_break')
    expect(HardBreakExtension.nodeSpec).toBeDefined()
    expect(HardBreakExtension.nodeSpec?.inline).toBe(true)
    expect(HardBreakExtension.nodeSpec?.selectable).toBe(false)
  })

  it('HistoryExtension is a base extension without spec', () => {
    expect(HistoryExtension.name).toBe('history')
    expect(HistoryExtension.nodeSpec).toBeUndefined()
    expect(HistoryExtension.markSpec).toBeUndefined()
  })
})

describe('Extension parseDOM/toDOM via Editor', () => {
  function createEditorWithStarterKit(content?: string) {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const extensions = createStarterKit()
    const editor = new Editor({ element, extensions, content })
    return { editor, element }
  }

  it('parses bold via <strong> and preserves it', () => {
    const { editor } = createEditorWithStarterKit('<p><strong>bold</strong></p>')
    expect(editor.getHTML()).toContain('<strong>bold</strong>')
    editor.destroy()
  })

  it('parses italic via <em> and preserves it', () => {
    const { editor } = createEditorWithStarterKit('<p><em>italic</em></p>')
    expect(editor.getHTML()).toContain('<em>italic</em>')
    editor.destroy()
  })

  it('parses inline code via <code> and preserves it', () => {
    const { editor } = createEditorWithStarterKit('<p><code>code</code></p>')
    expect(editor.getHTML()).toContain('<code>code</code>')
    editor.destroy()
  })

  it('heading node exists and renders correct tag', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const extensions = createStarterKit()
    const editor = new Editor({ element, extensions })
    // Programmatically create heading node
    const { heading } = editor.schema.nodes
    const node = heading.create({ level: 2 }, editor.schema.text('Heading 2'))
    const tr = editor.view.state.tr.replaceSelectionWith(node)
    editor.view.dispatch(tr)
    expect(editor.getHTML()).toContain('<h2>')
    expect(editor.getHTML()).toContain('Heading 2')
    editor.destroy()
  })

  it('blockquote node exists and renders', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const extensions = createStarterKit()
    const editor = new Editor({ element, extensions })
    const { blockquote, paragraph } = editor.schema.nodes
    const bq = blockquote.create(null, paragraph.create(null, editor.schema.text('quoted')))
    const tr = editor.view.state.tr.replaceSelectionWith(bq)
    editor.view.dispatch(tr)
    expect(editor.getHTML()).toContain('<blockquote>')
    expect(editor.getHTML()).toContain('quoted')
    editor.destroy()
  })

  it('parses bullet list and preserves it', () => {
    const { editor } = createEditorWithStarterKit('<ul><li><p>item</p></li></ul>')
    expect(editor.getHTML()).toContain('<ul>')
    expect(editor.getHTML()).toContain('item')
    editor.destroy()
  })

  it('ordered list node exists and renders', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const extensions = createStarterKit()
    const editor = new Editor({ element, extensions })
    const { ordered_list, list_item, paragraph } = editor.schema.nodes
    const li = list_item.create(null, paragraph.create(null, editor.schema.text('item')))
    const ol = ordered_list.create(null, li)
    const tr = editor.view.state.tr.replaceSelectionWith(ol)
    editor.view.dispatch(tr)
    expect(editor.getHTML()).toContain('<ol')
    expect(editor.getHTML()).toContain('item')
    editor.destroy()
  })

  it('parses link with safe href and preserves it', () => {
    const { editor } = createEditorWithStarterKit('<p><a href="https://example.com">link</a></p>')
    expect(editor.getHTML()).toContain('href="https://example.com"')
    expect(editor.getHTML()).toContain('link')
    editor.destroy()
  })

  it('parses code block and preserves it', () => {
    const { editor } = createEditorWithStarterKit('<pre><code>const x = 1</code></pre>')
    expect(editor.getHTML()).toContain('const x = 1')
    editor.destroy()
  })

  it('horizontal rule node exists and renders', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const extensions = createStarterKit()
    const editor = new Editor({ element, extensions })
    const { horizontal_rule } = editor.schema.nodes
    const tr = editor.view.state.tr.replaceSelectionWith(horizontal_rule.create())
    editor.view.dispatch(tr)
    expect(editor.getHTML()).toContain('<hr>')
    editor.destroy()
  })
})

describe('Extension integration with Editor', () => {
  function createEditorWithStarterKit(content?: string) {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const extensions = createStarterKit()
    const editor = new Editor({ element, extensions, content })
    return { editor, element }
  }

  it('creates editor with StarterKit extensions', () => {
    const { editor } = createEditorWithStarterKit()
    expect(editor.schema.nodes.heading).toBeDefined()
    expect(editor.schema.nodes.blockquote).toBeDefined()
    expect(editor.schema.marks.bold).toBeDefined()
    expect(editor.schema.marks.link).toBeDefined()
    editor.destroy()
  })

  it('setContent and getHTML with StarterKit schema', () => {
    const { editor } = createEditorWithStarterKit()
    editor.setContent('<h1>Title</h1><p>Hello <strong>world</strong></p>')
    const html = editor.getHTML()
    expect(html).toContain('Title')
    expect(html).toContain('Hello')
    expect(html).toContain('world')
    editor.destroy()
  })

  it('sanitizes content with StarterKit schema', () => {
    const { editor } = createEditorWithStarterKit()
    editor.setContent('<p>Hello</p><script>alert(1)</script>')
    expect(editor.getHTML()).not.toContain('script')
    editor.destroy()
  })

  it('handles XSS in links with StarterKit', () => {
    const { editor } = createEditorWithStarterKit()
    editor.setContent('<p><a href="javascript:alert(1)">click</a></p>')
    expect(editor.getHTML()).not.toContain('javascript:')
    editor.destroy()
  })
})
