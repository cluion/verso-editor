import type { NodeSpec, Node as PMNode } from 'prosemirror-model'
import type { Command } from 'prosemirror-state'
import { Plugin, PluginKey } from 'prosemirror-state'
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  columnResizing,
  deleteColumn,
  deleteRow,
  deleteTable,
  goToNextCell,
  mergeCells,
  tableNodes as pmTableNodes,
  setCellAttr,
  splitCell,
  tableEditing,
  toggleHeaderColumn,
  toggleHeaderRow,
} from 'prosemirror-tables'
import type { EditorView } from 'prosemirror-view'

/**
 * Generate table node specs (table, table_row, table_cell)
 * with custom `background` and `header` attributes on table_cell.
 * Header cells render as `<th>`, regular cells as `<td>`.
 */
export function createTableSchema(): Record<string, NodeSpec> {
  const nodes = pmTableNodes({
    tableGroup: 'block',
    cellContent: 'paragraph+',
    cellAttributes: {
      background: {
        default: null,
        getFromDOM(dom: HTMLElement) {
          return dom.style.backgroundColor || null
        },
        setDOMAttr(value: unknown, attrs: Record<string, unknown>) {
          if (value) {
            attrs.style = `${attrs.style ?? ''}background-color: ${value};`
          }
        },
      },
      header: {
        default: false,
        getFromDOM(dom: HTMLElement) {
          return dom.nodeName === 'TH'
        },
        setDOMAttr(value: unknown, attrs: Record<string, unknown>) {
          if (value) {
            attrs.nodeName = 'th'
          }
        },
      },
    },
  })

  // Override table_cell toDOM to support <th> rendering
  if (nodes.table_cell) {
    const _originalToDOM = nodes.table_cell.toDOM
    nodes.table_cell.toDOM = (node: PMNode) => {
      const tag = node.attrs.header ? 'th' : 'td'
      const domAttrs: Record<string, unknown> = {}
      if (node.attrs.colspan) domAttrs.colspan = node.attrs.colspan
      if (node.attrs.rowspan) domAttrs.rowspan = node.attrs.rowspan
      if (node.attrs.colwidth) domAttrs.colwidth = node.attrs.colwidth
      if (node.attrs.background) {
        domAttrs.style = `background-color: ${node.attrs.background};`
      }
      return [tag, domAttrs, 0] as unknown as HTMLElement
    }

    // Override parseDOM to detect <th> vs <td>
    nodes.table_cell.parseDOM = [
      {
        tag: 'td',
        getAttrs: (dom: HTMLElement) => ({
          colspan: dom.getAttribute('colspan') ? Number(dom.getAttribute('colspan')) : 1,
          rowspan: dom.getAttribute('rowspan') ? Number(dom.getAttribute('rowspan')) : 1,
          background: dom.style.backgroundColor || null,
          header: false,
        }),
      },
      {
        tag: 'th',
        getAttrs: (dom: HTMLElement) => ({
          colspan: dom.getAttribute('colspan') ? Number(dom.getAttribute('colspan')) : 1,
          rowspan: dom.getAttribute('rowspan') ? Number(dom.getAttribute('rowspan')) : 1,
          background: dom.style.backgroundColor || null,
          header: true,
        }),
      },
    ]
  }

  return nodes
}

/**
 * Create a simple keymap plugin for table Tab navigation and header toggle.
 */
export function createTableKeymapPlugin(): Plugin {
  const key = new PluginKey('versoTableKeymap')
  return new Plugin({
    key,
    props: {
      handleKeyDown(view: EditorView, event: KeyboardEvent) {
        if (event.key === 'Tab') {
          const direction = event.shiftKey ? -1 : 1
          return goToNextCell(direction)(view.state, view.dispatch.bind(view))
        }
        // Mod+Shift+H to toggle header row
        if (event.key === 'h' && event.shiftKey && (event.metaKey || event.ctrlKey)) {
          return toggleHeaderRow(view.state, view.dispatch.bind(view))
        }
        return false
      },
    },
  })
}

/**
 * Create all table-related plugins:
 * - columnResizing (drag to resize columns)
 * - tableEditing (cell selection, copy/paste, structure)
 * - tableKeymap (Tab navigation, header toggle)
 */
export function createTablePlugins(): Plugin[] {
  return [columnResizing(), tableEditing(), createTableKeymapPlugin()]
}

/**
 * Create a command that inserts a table with the given dimensions.
 */
export function createInsertTableCommand(rows: number, cols: number): Command {
  return (state, dispatch) => {
    const { table_cell, table_row, table, paragraph } = state.schema.nodes
    if (!table || !table_row || !table_cell || !paragraph) return false

    const cells: PMNode[] = []
    for (let i = 0; i < cols; i++) {
      cells.push(table_cell.create(null, paragraph.create()))
    }
    const row = table_row.create(null, cells)
    const rowsArr: PMNode[] = []
    for (let i = 0; i < rows; i++) {
      rowsArr.push(row)
    }
    const tableNode = table.create(null, rowsArr)

    if (dispatch) {
      const tr = state.tr.replaceSelectionWith(tableNode)
      dispatch(tr)
    }
    return true
  }
}

/**
 * Create a command that sets the background color of selected cells.
 * Pass null to remove the background.
 */
export function createSetCellBackground(color: string | null): Command {
  return setCellAttr('background', color)
}

// Re-export commonly used prosemirror-tables commands for convenience
export {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  deleteColumn,
  deleteRow,
  deleteTable,
  mergeCells,
  splitCell,
  toggleHeaderColumn,
  toggleHeaderRow,
}
