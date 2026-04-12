import { Schema } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it } from 'vitest'
import { type SlashCommandItem, createSlashCommandPlugin } from '../index'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['p', 0] as unknown as HTMLElement,
    },
    text: { group: 'inline' },
    heading: {
      content: 'inline*',
      group: 'block',
      attrs: { level: { default: 1 } },
      toDOM: () => ['h1', 0] as unknown as HTMLElement,
    },
  },
})

const commands: SlashCommandItem[] = [
  { title: 'Paragraph', description: 'Add a paragraph', command: 'paragraph' },
  { title: 'Heading 1', description: 'Add heading level 1', command: 'heading1' },
  { title: 'Heading 2', description: 'Add heading level 2', command: 'heading2' },
]

let views: EditorView[] = []

afterEach(() => {
  for (const v of views) {
    v.destroy()
  }
  views = []
})

function createView(plugins: Plugin[] = []): EditorView {
  const element = document.createElement('div')
  document.body.appendChild(element)
  const doc = schema.nodes.doc.create(
    null,
    schema.nodes.paragraph.create(null, schema.text('Test')),
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

describe('Slash Commands', () => {
  it('creates a slash command plugin', () => {
    const plugin = createSlashCommandPlugin({ commands })
    expect(plugin).toBeInstanceOf(Plugin)
  })

  it('creates menu container on view init', () => {
    const plugin = createSlashCommandPlugin({ commands })
    const view = createView([plugin])

    const menu = document.querySelector('.vs-slash-menu')
    expect(menu).not.toBeNull()

    view.destroy()
    views = []
    const menuAfterDestroy = document.querySelector('.vs-slash-menu')
    expect(menuAfterDestroy).toBeNull()
  })

  it('hides menu initially', () => {
    const plugin = createSlashCommandPlugin({ commands })
    createView([plugin])

    const menu = document.querySelector('.vs-slash-menu') as HTMLElement
    expect(menu?.style.display).toBe('none')
  })

  it('accepts custom commands', () => {
    const customCommands: SlashCommandItem[] = [
      { title: 'Custom', description: 'Custom command', command: 'custom' },
    ]
    const plugin = createSlashCommandPlugin({ commands: customCommands })
    expect(plugin).toBeInstanceOf(Plugin)
  })

  it('sets aria-activedescendant on listbox when active', () => {
    const plugin = createSlashCommandPlugin({ commands })
    const view = createView([plugin])

    // Trigger slash command menu
    const slashEvent = new KeyboardEvent('keydown', { key: '/', bubbles: true })
    view.dom.dispatchEvent(slashEvent)

    const menu = view.dom.parentElement?.querySelector('.vs-slash-menu') as HTMLElement
    expect(menu).not.toBeNull()
    expect(menu?.getAttribute('aria-activedescendant')).toMatch(/^vs-slash-menu-\d+-item-\d+$/)

    view.destroy()
    views = []
  })

  it('assigns unique ids to menu items', () => {
    const plugin = createSlashCommandPlugin({ commands })
    const view = createView([plugin])

    const slashEvent = new KeyboardEvent('keydown', { key: '/', bubbles: true })
    view.dom.dispatchEvent(slashEvent)

    const items = view.dom.parentElement?.querySelectorAll('.vs-slash-menu__item')
    expect(items?.length).toBe(3)
    expect(items?.[0]?.id).toMatch(/^vs-slash-menu-\d+-item-\d+$/)
    expect(items?.[1]?.id).toMatch(/^vs-slash-menu-\d+-item-\d+$/)
    expect(items?.[0]?.id).not.toBe(items?.[1]?.id)

    view.destroy()
    views = []
  })

  it('updates aria-activedescendant on arrow navigation', () => {
    const plugin = createSlashCommandPlugin({ commands })
    const view = createView([plugin])

    // Open menu
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }))

    // Navigate down
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

    const menu = view.dom.parentElement?.querySelector('.vs-slash-menu') as HTMLElement
    const activedesc = menu?.getAttribute('aria-activedescendant')
    expect(activedesc).toMatch(/^vs-slash-menu-\d+-item-\d+$/)

    // The active item should be the second one (index 1)
    const items = view.dom.parentElement?.querySelectorAll('.vs-slash-menu__item')
    expect(items?.[1]?.id).toBe(activedesc)

    view.destroy()
    views = []
  })

  it('closes menu on Escape key', () => {
    const plugin = createSlashCommandPlugin({ commands })
    const view = createView([plugin])

    // Open menu
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }))

    const menu = view.dom.parentElement?.querySelector('.vs-slash-menu') as HTMLElement
    expect(menu?.style.display).toBe('block')

    // Close with Escape
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(menu?.style.display).toBe('none')

    view.destroy()
    views = []
  })

  it('renders item title and description', () => {
    const plugin = createSlashCommandPlugin({ commands })
    const view = createView([plugin])

    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }))

    const titles = view.dom.parentElement?.querySelectorAll('.vs-slash-menu__title')
    const descs = view.dom.parentElement?.querySelectorAll('.vs-slash-menu__desc')

    expect(titles?.[0]?.textContent).toBe('Paragraph')
    expect(descs?.[0]?.textContent).toBe('Add a paragraph')
    expect(titles?.[1]?.textContent).toBe('Heading 1')

    view.destroy()
    views = []
  })

  it('wraps selection on ArrowDown at last item', () => {
    const plugin = createSlashCommandPlugin({ commands })
    const view = createView([plugin])

    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }))

    // Navigate down 3 times (past last item)
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

    const menu = view.dom.parentElement?.querySelector('.vs-slash-menu') as HTMLElement
    const activedesc = menu?.getAttribute('aria-activedescendant')

    // Should wrap back to first item (index 0)
    const items = view.dom.parentElement?.querySelectorAll('.vs-slash-menu__item')
    expect(items?.[0]?.id).toBe(activedesc)

    view.destroy()
    views = []
  })

  it('wraps selection on ArrowUp at first item', () => {
    const plugin = createSlashCommandPlugin({ commands })
    const view = createView([plugin])

    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }))

    // Navigate up from first item (should wrap to last)
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))

    const menu = view.dom.parentElement?.querySelector('.vs-slash-menu') as HTMLElement
    const activedesc = menu?.getAttribute('aria-activedescendant')

    // Should wrap to last item (index 2)
    const items = view.dom.parentElement?.querySelectorAll('.vs-slash-menu__item')
    expect(items?.[2]?.id).toBe(activedesc)

    view.destroy()
    views = []
  })
})
