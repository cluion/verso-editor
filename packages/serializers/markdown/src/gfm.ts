import type MarkdownIt from 'markdown-it'
import type { MarkdownSerializerState } from 'prosemirror-markdown'
import type { Node as PMNode } from 'prosemirror-model'
import type { SerializerEntries } from './registry'

// ---------------------------------------------------------------------------
// 1.2 GFM Table Serializer (node → markdown table)
// ---------------------------------------------------------------------------

function serializeTable(state: MarkdownSerializerState, node: PMNode): void {
  if (node.childCount === 0) return

  const rows: string[][] = []
  // biome-ignore lint/complexity/noForEach: ProseMirror Node.forEach is the standard iteration API
  node.forEach((row) => {
    const cells: string[] = []
    // biome-ignore lint/complexity/noForEach: ProseMirror Node.forEach is the standard iteration API
    row.forEach((cell) => {
      cells.push(cell.textContent)
    })
    rows.push(cells)
  })

  if (rows.length === 0) return

  const colCount = rows[0].length
  const colWidths = Array.from({ length: colCount }, (_, i) =>
    Math.max(3, ...rows.map((r) => (r[i] ?? '').length)),
  )

  const formatRow = (cells: string[]) =>
    `| ${cells.map((c, i) => c.padEnd(colWidths[i] ?? 3)).join(' | ')} |`

  state.write(formatRow(rows[0]))
  state.ensureNewLine()

  const headerRow = node.child(0)
  const separators = Array.from({ length: colCount }, (_, i) => {
    const cell = headerRow.child(i)
    const align = (cell.attrs as Record<string, unknown>).align as string | undefined
    const w = colWidths[i] ?? 3
    if (align === 'center') return `:${'-'.repeat(Math.max(w - 2, 1))}:`
    if (align === 'right') return `${'-'.repeat(Math.max(w - 1, 2))}:`
    return '-'.repeat(Math.max(w, 3))
  })
  state.write(`| ${separators.join(' | ')} |`)
  state.ensureNewLine()

  for (let i = 1; i < rows.length; i++) {
    state.write(formatRow(rows[i]))
    state.ensureNewLine()
  }

  state.closeBlock(node)
}

// ---------------------------------------------------------------------------
// 1.3 GFM Table Parser (markdown table → table node)
// ---------------------------------------------------------------------------

const tableParserTokens: SerializerEntries['parserTokens'] = {
  table: { block: 'table' },
  thead: { ignore: true },
  tbody: { ignore: true },
  tr: { block: 'table_row' },
  th: {
    block: 'table_cell',
    getAttrs: (token: unknown) => {
      const t = token as { attrGet?: (name: string) => string | null }
      const style = t.attrGet?.('style') ?? ''
      const align = style.includes('center') ? 'center' : style.includes('right') ? 'right' : null
      return { header: true, align }
    },
  },
  td: {
    block: 'table_cell',
    getAttrs: (token: unknown) => {
      const t = token as { attrGet?: (name: string) => string | null }
      const style = t.attrGet?.('style') ?? ''
      const align = style.includes('center') ? 'center' : style.includes('right') ? 'right' : null
      return { header: false, align }
    },
  },
}

// ---------------------------------------------------------------------------
// 1.4 Task List Serializer & Parser
// ---------------------------------------------------------------------------

function serializeTaskList(state: MarkdownSerializerState, node: PMNode): void {
  state.renderList(node, '  ', () => '- ')
}

function serializeTaskItem(state: MarkdownSerializerState, node: PMNode): void {
  const checked = node.attrs.checked as boolean
  state.write(`[${checked ? 'x' : ' '}] `)
  state.renderInline(node)
  state.ensureNewLine()
}

const taskListParserTokens: SerializerEntries['parserTokens'] = {
  task_list_item: {
    block: 'taskItem',
    getAttrs: (token: unknown) => {
      const t = token as { attrGet?: (name: string) => string | null }
      return { checked: t.attrGet?.('class')?.includes('checked') ?? false }
    },
  },
}

// ---------------------------------------------------------------------------
// 1.5 Strikethrough Serializer & Parser
// ---------------------------------------------------------------------------

const strikethroughEntries: SerializerEntries = {
  marks: {
    strikethrough: {
      open: '~~',
      close: '~~',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
  },
  parserTokens: {
    s: { mark: 'strikethrough' },
  },
}

// ---------------------------------------------------------------------------
// 1.6 Autolink Serializer
// Override link mark to output <url> when text matches href
// ---------------------------------------------------------------------------

const linkMarkEntries: SerializerEntries = {
  marks: {
    link: {
      open(_state, mark, parent) {
        const href = (mark.attrs as Record<string, unknown>).href as string
        const text = parent?.textContent ?? ''
        if (href === text) return '<'
        return '['
      },
      close(_state, mark, parent) {
        const href = (mark.attrs as Record<string, unknown>).href as string
        const text = parent?.textContent ?? ''
        if (href === text) return '>'
        return `](${href})`
      },
      mixable: true,
    },
  },
}

// ---------------------------------------------------------------------------
// 1.7 Footnote Serializer & Parser
// ---------------------------------------------------------------------------

function serializeFootnoteRef(state: MarkdownSerializerState, node: PMNode): void {
  const id = (node.attrs as Record<string, unknown>).id as string
  state.write(`[^${id || node.attrs.number}]`)
}

function serializeFootnoteSection(state: MarkdownSerializerState, node: PMNode): void {
  state.ensureNewLine()
  for (let i = 0; i < node.childCount; i++) {
    const item = node.child(i)
    const id = (item.attrs as Record<string, unknown>).id as string
    state.write(`[^${id}]: `)
    state.renderInline(item)
    state.ensureNewLine()
  }
  state.closeBlock(node)
}

const footnoteParserTokens: SerializerEntries['parserTokens'] = {
  footnote_ref: {
    node: 'footnoteReference',
    getAttrs: (token: unknown) => {
      const t = token as { meta?: { id?: string }; content?: string }
      return {
        id: t.meta?.id ?? t.content ?? '',
        number: Number.parseInt(t.content ?? '1', 10) || 1,
      }
    },
  },
  footnote_block: { block: 'footnoteSection' },
  footnote: {
    block: 'footnoteItem',
    getAttrs: (token: unknown) => {
      const t = token as { meta?: { id?: string }; content?: string }
      return {
        id: t.meta?.id ?? t.content ?? '',
        number: Number.parseInt(t.content ?? '1', 10) || 1,
      }
    },
  },
}

// ---------------------------------------------------------------------------
// Markdown-it plugin for task list support
// ---------------------------------------------------------------------------

function taskListPlugin(md: MarkdownIt): void {
  // biome-ignore lint/suspicious/noExplicitAny: markdown-it StateCore type not exported
  md.core.ruler.after('inline', 'task-lists', (state: any) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i]
      if (tok.type !== 'list_item_open') continue

      const marker = tokens[i + 2]
      if (!marker || marker.type !== 'inline') continue

      const firstChild = marker.children?.[0]
      if (!firstChild || firstChild.type !== 'text') continue

      const match = firstChild.content.match(/^\[([ xX])\]\s*/)
      if (!match) continue

      tok.type = 'task_list_item_open'
      if (match[1] !== ' ') {
        tok.attrSet?.('class', 'checked')
      }
      firstChild.content = firstChild.content.slice(match[0].length)
      if (!firstChild.content) {
        marker.children?.shift()
      }
    }
  })
}

// ---------------------------------------------------------------------------
// Markdown-it plugin for footnote support (basic)
// ---------------------------------------------------------------------------

function footnotePlugin(md: MarkdownIt): void {
  // biome-ignore lint/suspicious/noExplicitAny: markdown-it StateInline type not exported
  md.inline.ruler.after('image', 'footnote_ref', (state: any, silent: boolean) => {
    const start = state.pos
    if (state.src.charCodeAt(start) !== 0x5b /* [ */) return false
    if (state.src.charCodeAt(start + 1) !== 0x5e /* ^ */) return false

    const match = state.src.slice(start).match(/^\[\^(\w+)\]/)
    if (!match) return false

    if (!silent) {
      const token = state.push('footnote_ref', '', 0)
      token.meta = { id: match[1] }
      token.content = match[1]
    }

    state.pos += match[0].length
    return true
  })
}

// ---------------------------------------------------------------------------
// Export all GFM entries
// ---------------------------------------------------------------------------

export const gfmEntries: SerializerEntries = {
  nodes: {
    table: serializeTable,
    table_row: (state, node) => {
      state.renderContent(node)
    },
    table_cell: (state, node) => {
      state.renderInline(node)
    },
    taskList: serializeTaskList,
    taskItem: serializeTaskItem,
    footnoteReference: serializeFootnoteRef,
    footnoteSection: serializeFootnoteSection,
    footnoteItem: (state, node) => {
      state.renderInline(node)
    },
  },
  marks: {
    ...strikethroughEntries.marks,
    ...linkMarkEntries.marks,
  },
  parserTokens: {
    ...tableParserTokens,
    ...taskListParserTokens,
    ...strikethroughEntries.parserTokens,
    ...footnoteParserTokens,
  },
  tokenizerPlugins: [taskListPlugin, footnotePlugin],
}
