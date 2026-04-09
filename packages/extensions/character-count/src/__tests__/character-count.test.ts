import { Schema } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it } from 'vitest'
import { characterCountKey, createCharacterCountPlugin } from '../index'

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
})

let views: EditorView[] = []

afterEach(() => {
  for (const v of views) {
    v.destroy()
  }
  views = []
})

function createView(plugins: Plugin[] = [], content = 'Hello world'): EditorView {
  const element = document.createElement('div')
  document.body.appendChild(element)
  const doc = schema.nodes.doc.create(
    null,
    schema.nodes.paragraph.create(null, schema.text(content)),
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

function getCounts(view: EditorView): { characters: number; words: number } {
  const state = characterCountKey.getState(view.state)
  return state ?? { characters: 0, words: 0 }
}

describe('Character Count', () => {
  it('creates a plugin instance', () => {
    const plugin = createCharacterCountPlugin()
    expect(plugin).toBeInstanceOf(Plugin)
  })

  it('counts characters in the document', () => {
    const plugin = createCharacterCountPlugin()
    const view = createView([plugin], 'Hello world')

    const { characters } = getCounts(view)
    expect(characters).toBe(11) // "Hello world" = 11 characters
  })

  it('counts words in the document', () => {
    const plugin = createCharacterCountPlugin()
    const view = createView([plugin], 'Hello world')

    const { words } = getCounts(view)
    expect(words).toBe(2) // "Hello" and "world"
  })

  it('updates counts when document changes', () => {
    const plugin = createCharacterCountPlugin()
    const view = createView([plugin], 'Hi')

    expect(getCounts(view).characters).toBe(2)
    expect(getCounts(view).words).toBe(1)

    // Replace document content
    const p = schema.nodes.paragraph.create(null, schema.text('Hello world'))
    const newDoc = schema.nodes.doc.create(null, p)
    const tr = view.state.tr.replaceWith(0, view.state.doc.content.size, newDoc.content)
    view.dispatch(tr)

    const countsAfter = getCounts(view)
    expect(countsAfter.characters).toBe(11) // "Hello world"
    expect(countsAfter.words).toBe(2)
  })

  it('returns 0 for empty document', () => {
    const plugin = createCharacterCountPlugin()
    const element = document.createElement('div')
    document.body.appendChild(element)
    const doc = schema.nodes.doc.create(null, schema.nodes.paragraph.create())
    const view = new EditorView(element, {
      state: EditorState.create({ doc, plugins: [plugin] }),
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr)
        view.updateState(newState)
      },
    })
    views.push(view)

    expect(getCounts(view).characters).toBe(0)
    expect(getCounts(view).words).toBe(0)
  })

  describe('limit', () => {
    it('does not limit when no limit is set', () => {
      const plugin = createCharacterCountPlugin()
      const view = createView([plugin], 'A'.repeat(100))

      // No limit, all characters counted
      expect(getCounts(view).characters).toBe(100)
    })

    it('tracks limit and remaining when limit is set', () => {
      const plugin = createCharacterCountPlugin({ limit: 50 })
      const view = createView([plugin], 'Hello')

      const state = plugin.getState(view.state) as {
        characters: number
        words: number
        limit: number | undefined
        remaining: number
      }
      expect(state.limit).toBe(50)
      expect(state.remaining).toBe(45)
    })

    it('calculates remaining as negative when over limit', () => {
      const plugin = createCharacterCountPlugin({ limit: 5 })
      const view = createView([plugin], 'Hello world')

      const state = plugin.getState(view.state) as {
        characters: number
        remaining: number
      }
      expect(state.remaining).toBe(-6)
    })
  })

  it('counts words correctly with multiple spaces', () => {
    const plugin = createCharacterCountPlugin()
    const view = createView([plugin], 'Hello   world')

    expect(getCounts(view).words).toBe(2)
  })
})
