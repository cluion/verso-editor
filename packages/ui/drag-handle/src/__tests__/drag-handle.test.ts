import { Schema } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it } from 'vitest'
import { createDragHandlePlugin } from '../index'

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
  for (const view of views) {
    view.destroy()
  }
  views = []
})

function createView(plugins: Plugin[] = []): EditorView {
  const element = document.createElement('div')
  document.body.appendChild(element)
  const doc = schema.nodes.doc.create(
    null,
    schema.nodes.paragraph.create(null, schema.text('Hello')),
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

describe('Drag Handle', () => {
  it('creates a drag handle plugin', () => {
    const plugin = createDragHandlePlugin()
    expect(plugin).toBeInstanceOf(Plugin)
    expect(plugin.spec).toBeDefined()
  })

  it('creates handle DOM element on view creation', () => {
    const plugin = createDragHandlePlugin()
    const view = createView([plugin])

    const handle = view.dom.parentElement?.querySelector('.vs-drag-handle')
    expect(handle).not.toBeNull()
  })

  it('hides handle initially', () => {
    const plugin = createDragHandlePlugin()
    const view = createView([plugin])

    const handle = view.dom.parentElement?.querySelector('.vs-drag-handle') as HTMLElement
    expect(handle?.style.display).toBe('none')
  })

  it('destroys handle on plugin destroy', () => {
    const plugin = createDragHandlePlugin()
    const view = createView([plugin])
    const parent = view.dom.parentElement

    view.destroy()
    views = []

    const handle = parent?.querySelector('.vs-drag-handle')
    expect(handle).toBeNull()
  })
})
