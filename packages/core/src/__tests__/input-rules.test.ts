import { Plugin } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { Editor } from '../editor'
import { createInputRulesPlugin } from '../input-rules'
import { defaultSchema } from '../schema'

describe('createInputRulesPlugin', () => {
  it('returns a ProseMirror plugin', () => {
    const plugin = createInputRulesPlugin(defaultSchema)
    expect(plugin).toBeInstanceOf(Plugin)
  })

  it('plugin has correct key', () => {
    const plugin = createInputRulesPlugin(defaultSchema)
    expect(plugin.spec.key).toBeDefined()
  })
})

/**
 * Simulate pasting/typing a complete pattern by inserting text then
 * firing handleTextInput for the last character to trigger input rules.
 */
function triggerInputRule(view: EditorView, fullText: string): void {
  // Insert all but the last character via normal transaction
  const prefix = fullText.slice(0, -1)
  const lastChar = fullText.slice(-1)
  if (prefix) {
    view.dispatch(view.state.tr.insertText(prefix))
  }
  // The last character goes through handleTextInput, which triggers input rules
  const pos = view.state.selection.$head.pos
  const handled = view.someProp('handleTextInput', (f) => f(view, pos, pos, lastChar))
  if (!handled) {
    view.dispatch(view.state.tr.insertText(lastChar))
  }
}

import type { EditorView } from 'prosemirror-view'

describe('Inline mark input rules', () => {
  function createEditor() {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({ element })
    return { editor, element }
  }

  describe('bold (**text**)', () => {
    it('applies bold mark when typing **text**', () => {
      const { editor } = createEditor()
      triggerInputRule(editor.view, '**hello**')
      const html = editor.getHTML()
      expect(html).toContain('<strong>hello</strong>')
      expect(html).not.toContain('**')
      editor.destroy()
    })

    it('does not trigger for unmatched double asterisks', () => {
      const { editor } = createEditor()
      // Just insert text without triggering input rule
      editor.view.dispatch(editor.view.state.tr.insertText('**hello'))
      const html = editor.getHTML()
      expect(html).toContain('**hello')
      editor.destroy()
    })

    it('applies bold to multi-word text', () => {
      const { editor } = createEditor()
      triggerInputRule(editor.view, '**hello world**')
      const html = editor.getHTML()
      expect(html).toContain('<strong>hello world</strong>')
      editor.destroy()
    })
  })

  describe('italic (*text*)', () => {
    it('applies italic mark when typing *text*', () => {
      const { editor } = createEditor()
      triggerInputRule(editor.view, '*hello*')
      const html = editor.getHTML()
      expect(html).toContain('<em>hello</em>')
      editor.destroy()
    })

    it('does not trigger for unmatched single asterisk', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('*hello'))
      const html = editor.getHTML()
      expect(html).toContain('*hello')
      editor.destroy()
    })
  })

  describe('inline code (`text`)', () => {
    it('applies code mark when typing `text`', () => {
      const { editor } = createEditor()
      triggerInputRule(editor.view, '`hello`')
      const html = editor.getHTML()
      expect(html).toContain('<code>hello</code>')
      editor.destroy()
    })

    it('does not trigger for unmatched backtick', () => {
      const { editor } = createEditor()
      editor.view.dispatch(editor.view.state.tr.insertText('`hello'))
      const html = editor.getHTML()
      expect(html).toContain('`hello')
      editor.destroy()
    })
  })
})
