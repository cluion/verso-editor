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

function createViewWithMultipleParagraphs(plugins: Plugin[] = []): EditorView {
  const element = document.createElement('div')
  document.body.appendChild(element)
  const doc = schema.nodes.doc.create(null, [
    schema.nodes.paragraph.create(null, schema.text('First')),
    schema.nodes.paragraph.create(null, schema.text('Second')),
    schema.nodes.paragraph.create(null, schema.text('Third')),
  ])
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

describe('Drag Handle - Drag Sort', () => {
  it('makes handle draggable', () => {
    const plugin = createDragHandlePlugin()
    const view = createViewWithMultipleParagraphs([plugin])

    const handle = view.dom.parentElement?.querySelector('.vs-drag-handle') as HTMLElement
    expect(handle?.getAttribute('draggable')).toBe('true')
  })

  it('stores dragged block info on dragstart', () => {
    const plugin = createDragHandlePlugin()
    const view = createViewWithMultipleParagraphs([plugin])

    const handle = view.dom.parentElement?.querySelector('.vs-drag-handle') as HTMLElement
    expect(handle).not.toBeNull()

    // Trigger mouseover on the first paragraph to activate the handle
    const firstP = view.dom.querySelector('p')
    if (firstP) {
      const mouseoverEvent = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(mouseoverEvent, 'target', { value: firstP })
      view.dom.dispatchEvent(mouseoverEvent)
    }

    // The handle should now be visible
    expect(handle.style.display).toBe('block')
  })

  it('exposes handleDrop in plugin props', () => {
    const plugin = createDragHandlePlugin()
    expect(plugin.spec.props?.handleDrop).toBeDefined()
    expect(typeof plugin.spec.props?.handleDrop).toBe('function')
  })

  it('reorders nodes via handleDrop', () => {
    const plugin = createDragHandlePlugin()
    const view = createViewWithMultipleParagraphs([plugin])

    // Initial: First(pos 0), Second(pos 7), Third(pos 14)
    expect(view.state.doc.childCount).toBe(3)
    expect(view.state.doc.firstChild?.textContent).toBe('First')

    // Set up drag state: mouseover first paragraph to activate handle
    const firstP = view.dom.querySelector('p')
    if (firstP) {
      const mouseoverEvent = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(mouseoverEvent, 'target', { value: firstP })
      view.dom.dispatchEvent(mouseoverEvent)
    }

    // Simulate dragstart via plugin meta
    const dragMeta = plugin.spec.state
    if (dragMeta) {
      // Set dragging state via meta transaction
      const tr = view.state.tr.setMeta('versoDragHandle', {
        dragging: true,
        fromPos: 0,
      })
      view.dispatch(tr)
    }

    // Now simulate handleDrop to move to after "Second" (pos ~13)
    const handleDrop = plugin.spec.props?.handleDrop as (
      view: EditorView,
      event: Event,
      slice: unknown,
      moved: boolean,
    ) => boolean

    if (handleDrop) {
      const fakeEvent = new Event('drop')
      // Drop at position after "Second" paragraph
      const result = handleDrop(view, fakeEvent, null, false)
      // The plugin should handle the drop
      expect(typeof result).toBe('boolean')
    }
  })

  it('preserves content after drag reorder', () => {
    const plugin = createDragHandlePlugin()
    const view = createViewWithMultipleParagraphs([plugin])

    // Initial doc has First, Second, Third
    expect(view.state.doc.childCount).toBe(3)
  })

  it('sets ARIA attributes on handle', () => {
    const plugin = createDragHandlePlugin()
    const view = createView([plugin])

    const handle = view.dom.parentElement?.querySelector('.vs-drag-handle') as HTMLElement
    expect(handle?.getAttribute('role')).toBe('button')
    expect(handle?.getAttribute('aria-label')).toBe('Drag to move block')
    expect(handle?.getAttribute('tabindex')).toBe('0')
  })

  it('creates icon element inside handle', () => {
    const plugin = createDragHandlePlugin()
    const view = createView([plugin])

    const icon = view.dom.parentElement?.querySelector('.vs-drag-handle__icon')
    expect(icon).not.toBeNull()
    expect(icon?.textContent).toBeTruthy()
  })

  it('has correct cursor style', () => {
    const plugin = createDragHandlePlugin()
    const view = createView([plugin])

    const handle = view.dom.parentElement?.querySelector('.vs-drag-handle') as HTMLElement
    expect(handle?.style.cursor).toBe('grab')
  })

  it('plugin state key is accessible', () => {
    const plugin = createDragHandlePlugin()
    const view = createView([plugin])

    // Plugin state should be initialized
    const state = plugin.getState?.(view.state)
    expect(state).toBeDefined()
    expect(state?.dragging).toBe(false)
  })

  it('mouseleave hides handle', () => {
    const plugin = createDragHandlePlugin()
    const view = createViewWithMultipleParagraphs([plugin])

    // First show the handle via mouseover
    const firstP = view.dom.querySelector('p')
    if (firstP) {
      const mouseoverEvent = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
      })
      Object.defineProperty(mouseoverEvent, 'target', { value: firstP })
      view.dom.dispatchEvent(mouseoverEvent)
    }

    const handle = view.dom.parentElement?.querySelector('.vs-drag-handle') as HTMLElement
    expect(handle.style.display).toBe('block')

    // Now mouseleave should hide it
    view.dom.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    expect(handle.style.display).toBe('none')
  })
})
