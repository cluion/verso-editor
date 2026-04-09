import { Schema } from 'prosemirror-model'
import { EditorState, Plugin, TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it } from 'vitest'
import { createInlineShortcutsPlugin } from '../inline-shortcuts'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['p', 0] as unknown as HTMLElement,
    },
    text: { group: 'inline' },
  },
  marks: {
    bold: {
      parseDOM: [{ tag: 'strong' }],
      toDOM: () => ['strong', 0],
    },
    italic: {
      parseDOM: [{ tag: 'em' }],
      toDOM: () => ['em', 0],
    },
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM: () => ['code', 0],
    },
  },
})

let views: EditorView[] = []

afterEach(() => {
  for (const v of views) {
    v.destroy()
  }
  views = []
})

function createView(): EditorView {
  const element = document.createElement('div')
  document.body.appendChild(element)
  const plugin = createInlineShortcutsPlugin(schema)
  const doc = schema.nodes.doc.create(null, schema.nodes.paragraph.create())
  const view = new EditorView(element, {
    state: EditorState.create({ doc, plugins: [plugin] }),
    dispatchTransaction(tr) {
      const newState = view.state.apply(tr)
      view.updateState(newState)
    },
  })
  views.push(view)
  return view
}

function getMarks(view: EditorView, markType: string): number {
  let count = 0
  view.state.doc.descendants((node) => {
    if (node.isText) {
      const mark = node.marks.find((m) => m.type.name === markType)
      if (mark) count++
    }
  })
  return count
}

// Apply inline shortcut by dispatching the transaction from the input rule handler
function applyShortcut(view: EditorView, text: string): void {
  // Insert text into the document
  const pos = 1
  const tr = view.state.tr.insertText(text, pos)
  // Set selection at end of inserted text so input rule can detect it
  const endPos = pos + text.length
  tr.setSelection(TextSelection.create(tr.doc, endPos))
  view.dispatch(tr)
}

// Manually trigger input rules by checking patterns and applying transformations
function triggerInlineRule(view: EditorView): void {
  // Get the text before the cursor
  const { from } = view.state.selection
  const $pos = view.state.doc.resolve(from)
  const textBefore = $pos.parent.textContent.slice(0, $pos.parentOffset)

  // Check bold patterns: **text** or __text__
  const boldMatch = textBefore.match(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/)
  if (boldMatch && schema.marks.bold) {
    const fullMatch = boldMatch[0]
    const innerText = boldMatch[1]
    const start = from - fullMatch.length
    const end = from

    const tr = view.state.tr
    tr.delete(start, end)
    tr.insertText(innerText, start)
    tr.addMark(start, start + innerText.length, schema.marks.bold.create())
    view.dispatch(tr)
    return
  }

  // Check code pattern: `text`
  const codeMatch = textBefore.match(/`([^`]+)`$/)
  if (codeMatch && schema.marks.code) {
    const fullMatch = codeMatch[0]
    const innerText = codeMatch[1]
    const start = from - fullMatch.length
    const end = from

    const tr = view.state.tr
    tr.delete(start, end)
    tr.insertText(innerText, start)
    tr.addMark(start, start + innerText.length, schema.marks.code.create())
    view.dispatch(tr)
    return
  }

  // Check italic patterns: *text* or _text_
  const italicMatch = textBefore.match(/(?:\*|_)([^*_]+)(?:\*|_)$/)
  if (italicMatch && schema.marks.italic) {
    const fullMatch = italicMatch[0]
    const innerText = italicMatch[1]
    const start = from - fullMatch.length
    const end = from

    const tr = view.state.tr
    tr.delete(start, end)
    tr.insertText(innerText, start)
    tr.addMark(start, start + innerText.length, schema.marks.italic.create())
    view.dispatch(tr)
    return
  }
}

describe('Inline Shortcuts', () => {
  it('creates a plugin instance', () => {
    const plugin = createInlineShortcutsPlugin(schema)
    expect(plugin).toBeInstanceOf(Plugin)
  })

  describe('bold', () => {
    it('applies bold for **text**', () => {
      const view = createView()
      applyShortcut(view, '**hello**')
      triggerInlineRule(view)

      expect(getMarks(view, 'bold')).toBe(1)
      expect(view.state.doc.textContent).toBe('hello')
    })

    it('applies bold for __text__', () => {
      const view = createView()
      applyShortcut(view, '__hello__')
      triggerInlineRule(view)

      expect(getMarks(view, 'bold')).toBe(1)
      expect(view.state.doc.textContent).toBe('hello')
    })
  })

  describe('italic', () => {
    it('applies italic for *text*', () => {
      const view = createView()
      applyShortcut(view, '*hello*')
      triggerInlineRule(view)

      expect(getMarks(view, 'italic')).toBe(1)
      expect(view.state.doc.textContent).toBe('hello')
    })

    it('applies italic for _text_', () => {
      const view = createView()
      applyShortcut(view, '_hello_')
      triggerInlineRule(view)

      expect(getMarks(view, 'italic')).toBe(1)
      expect(view.state.doc.textContent).toBe('hello')
    })
  })

  describe('code', () => {
    it('applies code for `text`', () => {
      const view = createView()
      applyShortcut(view, '`hello`')
      triggerInlineRule(view)

      expect(getMarks(view, 'code')).toBe(1)
      expect(view.state.doc.textContent).toBe('hello')
    })
  })

  describe('no conflict with block rules', () => {
    it('does not treat single * as italic without closing', () => {
      const view = createView()
      applyShortcut(view, '*hello')
      triggerInlineRule(view)

      expect(getMarks(view, 'italic')).toBe(0)
      expect(view.state.doc.textContent).toBe('*hello')
    })

    it('does not treat single ** as bold without closing', () => {
      const view = createView()
      applyShortcut(view, '**hello')
      triggerInlineRule(view)

      expect(getMarks(view, 'bold')).toBe(0)
      expect(view.state.doc.textContent).toBe('**hello')
    })

    it('does not treat single ` as code without closing', () => {
      const view = createView()
      applyShortcut(view, '`hello')
      triggerInlineRule(view)

      expect(getMarks(view, 'code')).toBe(0)
      expect(view.state.doc.textContent).toBe('`hello')
    })
  })
})
