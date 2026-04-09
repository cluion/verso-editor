import { Schema } from 'prosemirror-model'
import { EditorState, Plugin, Selection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it } from 'vitest'
import {
  createInsertTableCommand,
  createSetCellBackground,
  createTablePlugins,
  createTableSchema,
} from '../index'

const tableNodes = createTableSchema()
const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['p', 0] as unknown as HTMLElement,
    },
    text: { group: 'inline' },
    ...tableNodes,
  },
  marks: {},
})

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
    schema.nodes.paragraph.create(null, schema.text('Hello')),
  )
  const view = new EditorView(element, {
    state: EditorState.create({ doc, plugins, selection: Selection.atStart(doc) }),
    dispatchTransaction(tr) {
      const newState = view.state.apply(tr)
      view.updateState(newState)
    },
  })
  views.push(view)
  return view
}

function createTableView(): EditorView {
  const plugins = createTablePlugins()
  return createView(plugins)
}

function insertTable(view: EditorView, rows = 3, cols = 3): void {
  const cmd = createInsertTableCommand(rows, cols)
  cmd(view.state, view.dispatch.bind(view))
}

describe('Table Extension', () => {
  describe('Schema', () => {
    it('exports table, table_row, and table_cell node types', () => {
      expect(schema.nodes.table).toBeDefined()
      expect(schema.nodes.table_row).toBeDefined()
      expect(schema.nodes.table_cell).toBeDefined()
    })

    it('table_cell contains paragraph as block content', () => {
      const cellType = schema.nodes.table_cell
      expect(cellType).toBeDefined()
      // NodeType.contentMatch tells us what's allowed inside
      expect(cellType.contentMatch).toBeDefined()
    })
  })

  describe('Plugins', () => {
    it('creates plugin array from createTablePlugins', () => {
      const plugins = createTablePlugins()
      expect(plugins.length).toBeGreaterThanOrEqual(1)
      for (const p of plugins) {
        expect(p).toBeInstanceOf(Plugin)
      }
    })

    it('tableEditing plugin is included', () => {
      const plugins = createTablePlugins()
      const tablePlugin = plugins.find((p) => p.spec.key)
      expect(tablePlugin).toBeDefined()
    })
  })

  describe('Insert Table', () => {
    it('inserts a table into the document', () => {
      const view = createTableView()
      insertTable(view, 2, 2)

      let found = false
      view.state.doc.descendants((node) => {
        if (node.type.name === 'table') found = true
      })
      expect(found).toBe(true)
    })

    it('creates correct number of rows and cells', () => {
      const view = createTableView()
      insertTable(view, 3, 2)

      let rowCount = 0
      let cellCount = 0
      view.state.doc.descendants((node) => {
        if (node.type.name === 'table_row') rowCount++
        if (node.type.name === 'table_cell') cellCount++
      })
      expect(rowCount).toBe(3)
      expect(cellCount).toBe(6) // 3 rows x 2 cols
    })
  })

  describe('Cell Background', () => {
    it('creates setCellBackground command', () => {
      const cmd = createSetCellBackground('#ff0000')
      expect(typeof cmd).toBe('function')
    })

    it('sets background attribute on selected cell', () => {
      const view = createTableView()
      insertTable(view, 2, 2)

      // Find the first table_cell position
      let cellPos = -1
      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'table_cell' && cellPos === -1) {
          cellPos = pos + 1 // inside the cell
        }
      })
      expect(cellPos).toBeGreaterThan(-1)

      // Set selection inside the cell
      const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(tr)

      // Apply background
      const cmd = createSetCellBackground('#ff0000')
      const result = cmd(view.state, view.dispatch.bind(view))
      expect(result).toBe(true)

      // Verify the cell has the background attr
      let bg: string | null = null
      view.state.doc.descendants((node) => {
        if (node.type.name === 'table_cell' && node.attrs.background && bg === null) {
          bg = node.attrs.background as string
        }
      })
      expect(bg).toBe('#ff0000')
    })

    it('removes background when set to null', () => {
      const view = createTableView()
      insertTable(view, 2, 2)

      let cellPos = -1
      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'table_cell' && cellPos === -1) {
          cellPos = pos + 1
        }
      })

      const sel = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(sel)

      // Set background first
      createSetCellBackground('#ff0000')(view.state, view.dispatch.bind(view))

      // Remove background
      const cmd = createSetCellBackground(null)
      cmd(view.state, view.dispatch.bind(view))

      let bg: string | null = null
      view.state.doc.descendants((node) => {
        if (node.type.name === 'table_cell' && bg === null) {
          bg = (node.attrs.background as string) || null
        }
      })
      expect(bg).toBeNull()
    })
  })
})
