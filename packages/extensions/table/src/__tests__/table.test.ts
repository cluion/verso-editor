import { Schema } from 'prosemirror-model'
import { EditorState, Plugin, Selection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it } from 'vitest'
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  createInsertTableCommand,
  createSetCellBackground,
  createTablePlugins,
  createTableSchema,
  deleteColumn,
  deleteRow,
  deleteTable,
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

function countNodes(view: EditorView, typeName: string): number {
  let count = 0
  view.state.doc.descendants((node) => {
    if (node.type.name === typeName) count++
  })
  return count
}

function findCellPos(view: EditorView, index = 0): number {
  let found = -1
  let i = 0
  view.state.doc.descendants((node, pos) => {
    if (node.type.name === 'table_cell' && i === index && found === -1) {
      found = pos + 1
    }
    if (node.type.name === 'table_cell') i++
  })
  return found
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

      expect(countNodes(view, 'table')).toBe(1)
    })

    it('creates correct number of rows and cells', () => {
      const view = createTableView()
      insertTable(view, 3, 2)

      expect(countNodes(view, 'table_row')).toBe(3)
      expect(countNodes(view, 'table_cell')).toBe(6)
    })
  })

  describe('Table Operations', () => {
    it('addRowAfter adds a row', () => {
      const view = createTableView()
      insertTable(view, 2, 2)
      const before = countNodes(view, 'table_row')

      const cellPos = findCellPos(view, 0)
      const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(tr)

      addRowAfter(view.state, view.dispatch.bind(view))
      expect(countNodes(view, 'table_row')).toBe(before + 1)
    })

    it('addRowBefore adds a row', () => {
      const view = createTableView()
      insertTable(view, 2, 2)
      const before = countNodes(view, 'table_row')

      const cellPos = findCellPos(view, 0)
      const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(tr)

      addRowBefore(view.state, view.dispatch.bind(view))
      expect(countNodes(view, 'table_row')).toBe(before + 1)
    })

    it('addColumnAfter adds a column', () => {
      const view = createTableView()
      insertTable(view, 2, 2)
      const before = countNodes(view, 'table_cell')

      const cellPos = findCellPos(view, 0)
      const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(tr)

      addColumnAfter(view.state, view.dispatch.bind(view))
      expect(countNodes(view, 'table_cell')).toBe(before + 2)
    })

    it('addColumnBefore adds a column', () => {
      const view = createTableView()
      insertTable(view, 2, 2)
      const before = countNodes(view, 'table_cell')

      const cellPos = findCellPos(view, 0)
      const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(tr)

      addColumnBefore(view.state, view.dispatch.bind(view))
      expect(countNodes(view, 'table_cell')).toBe(before + 2)
    })

    it('deleteRow removes a row', () => {
      const view = createTableView()
      insertTable(view, 3, 2)
      const before = countNodes(view, 'table_row')

      const cellPos = findCellPos(view, 0)
      const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(tr)

      deleteRow(view.state, view.dispatch.bind(view))
      expect(countNodes(view, 'table_row')).toBe(before - 1)
    })

    it('deleteColumn removes a column', () => {
      const view = createTableView()
      insertTable(view, 2, 3)
      const before = countNodes(view, 'table_cell')

      const cellPos = findCellPos(view, 0)
      const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(tr)

      deleteColumn(view.state, view.dispatch.bind(view))
      expect(countNodes(view, 'table_cell')).toBe(before - 2)
    })

    it('deleteTable removes entire table', () => {
      const view = createTableView()
      insertTable(view, 2, 2)
      expect(countNodes(view, 'table')).toBe(1)

      const cellPos = findCellPos(view, 0)
      const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(tr)

      deleteTable(view.state, view.dispatch.bind(view))
      expect(countNodes(view, 'table')).toBe(0)
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

      const cellPos = findCellPos(view, 0)
      const tr = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(tr)

      const cmd = createSetCellBackground('#ff0000')
      const result = cmd(view.state, view.dispatch.bind(view))
      expect(result).toBe(true)

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

      const cellPos = findCellPos(view, 0)
      const sel = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(cellPos)))
      view.dispatch(sel)

      createSetCellBackground('#ff0000')(view.state, view.dispatch.bind(view))

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
