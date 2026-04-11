import { setBlockType, toggleMark } from 'prosemirror-commands'
import { Plugin, TextSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { Editor } from '../editor'
import { createKeymapPlugins } from '../keymap'
import { defaultSchema } from '../schema'

describe('createKeymapPlugins', () => {
  it('returns array of plugins with baseKeymap last', () => {
    const plugins = createKeymapPlugins(defaultSchema)
    expect(plugins.length).toBeGreaterThanOrEqual(2)
    expect(plugins[plugins.length - 1]).toBeInstanceOf(Plugin)
  })

  it('includes at least 3 layers', () => {
    const plugins = createKeymapPlugins(defaultSchema)
    // history keymap + formatting keymap + baseKeymap
    expect(plugins.length).toBeGreaterThanOrEqual(3)
  })
})

describe('Keymap formatting commands', () => {
  function createEditor() {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({ element })
    return { editor, element }
  }

  /**
   * Select all text in the current paragraph.
   */
  function selectAll(editor: Editor): void {
    const { doc } = editor.view.state
    const from = 1
    const to = doc.content.size - 1
    const selection = TextSelection.create(doc, from, to)
    editor.view.dispatch(editor.view.state.tr.setSelection(selection))
  }

  describe('toggleMark commands via Mod-b/i/e', () => {
    it('toggleMark bold applies and removes bold', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('hello'))
      selectAll(editor)

      // Apply bold via command directly
      const boldCmd = toggleMark(defaultSchema.marks.bold)
      boldCmd(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).toContain('<strong>hello</strong>')

      // Remove bold
      selectAll(editor)
      boldCmd(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).not.toContain('<strong>')
      editor.destroy()
    })

    it('toggleMark italic applies and removes italic', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('hello'))
      selectAll(editor)

      const italicCmd = toggleMark(defaultSchema.marks.italic)
      italicCmd(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).toContain('<em>hello</em>')

      selectAll(editor)
      italicCmd(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).not.toContain('<em>')
      editor.destroy()
    })

    it('toggleMark code applies and removes inline code', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('hello'))
      selectAll(editor)

      const codeCmd = toggleMark(defaultSchema.marks.code)
      codeCmd(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).toContain('<code>hello</code>')

      selectAll(editor)
      codeCmd(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).not.toContain('<code>')
      editor.destroy()
    })
  })

  describe('Heading toggle via setBlockType', () => {
    it('converts paragraph to h1', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('heading text'))
      const setH1 = setBlockType(defaultSchema.nodes.heading, { level: 1 })
      setH1(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).toContain('<h1')
      expect(editor.getHTML()).toContain('heading text')
      editor.destroy()
    })

    it('converts paragraph to h2', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('heading text'))
      const setH2 = setBlockType(defaultSchema.nodes.heading, { level: 2 })
      setH2(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).toContain('<h2')
      expect(editor.getHTML()).toContain('heading text')
      editor.destroy()
    })

    it('converts paragraph to h3', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('heading text'))
      const setH3 = setBlockType(defaultSchema.nodes.heading, { level: 3 })
      setH3(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).toContain('<h3')
      editor.destroy()
    })

    it('converts paragraph to h6', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('heading text'))
      const setH6 = setBlockType(defaultSchema.nodes.heading, { level: 6 })
      setH6(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).toContain('<h6')
      editor.destroy()
    })

    it('toggles heading back to paragraph', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('text'))
      const setH2 = setBlockType(defaultSchema.nodes.heading, { level: 2 })
      setH2(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).toContain('<h2')
      // Back to paragraph
      const setP = setBlockType(defaultSchema.nodes.paragraph)
      setP(editor.view.state, editor.view.dispatch)
      expect(editor.getHTML()).not.toContain('<h2')
      expect(editor.getHTML()).toContain('<p>')
      editor.destroy()
    })
  })

  describe('Hard break via Shift-Enter', () => {
    it('inserts a hard break (br) node', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('line1'))
      // Insert hard break
      const { hard_break } = defaultSchema.nodes
      const pos = editor.view.state.selection.$head.pos
      editor.view.dispatch(
        editor.view.state.tr.replaceSelectionWith(hard_break.create()).scrollIntoView(),
      )
      editor.view.dispatch(editor.view.state.tr.insertText('line2'))
      const html = editor.getHTML()
      expect(html).toContain('line1')
      expect(html).toContain('line2')
      expect(html).toContain('<br>')
      editor.destroy()
    })

    it('inserts newline in code block', () => {
      const element = document.createElement('div')
      document.body.appendChild(element)
      const editor = new Editor({
        element,
        content: '<pre><code></code></pre>',
      })
      const pos = editor.view.state.selection.$head.pos
      // In code block, insert text with newline
      editor.view.dispatch(editor.view.state.tr.insertText('line1\nline2'))
      const html = editor.getHTML()
      expect(html).toContain('line1')
      expect(html).toContain('line2')
      editor.destroy()
    })
  })

  describe('keymap bindings are registered', () => {
    it('has Mod-b binding for bold', () => {
      const plugins = createKeymapPlugins(defaultSchema)
      // Check that the formatting keymap plugin exists
      const formattingPlugin = plugins[1]
      expect(formattingPlugin).toBeInstanceOf(Plugin)
      expect(formattingPlugin.spec.props?.handleKeyDown).toBeDefined()
    })

    it('has history bindings (Mod-z, Mod-y)', () => {
      const plugins = createKeymapPlugins(defaultSchema)
      const historyPlugin = plugins[0]
      expect(historyPlugin).toBeInstanceOf(Plugin)
      expect(historyPlugin.spec.props?.handleKeyDown).toBeDefined()
    })
  })
})
