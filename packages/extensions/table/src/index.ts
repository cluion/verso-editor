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
} from 'prosemirror-tables'
import type { EditorView } from 'prosemirror-view'

/**
 * Generate table node specs (table, table_row, table_cell)
 * with a custom `background` attribute on table_cell.
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
    },
  })
  return nodes
}

/**
 * Create a simple keymap plugin for table Tab navigation.
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
        return false
      },
    },
  })
}

/**
 * Create all table-related plugins:
 * - columnResizing (drag to resize columns)
 * - tableEditing (cell selection, copy/paste, structure)
 * - tableKeymap (Tab navigation)
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
}
