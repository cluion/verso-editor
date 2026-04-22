import { Extension, MarkExtension } from '@verso-editor/core'
import type { Mark as ProseMirrorMark } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorState, Transaction } from 'prosemirror-state'

// ---------------------------------------------------------------------------
// Plugin key shared across the extension
// ---------------------------------------------------------------------------

const trackChangesKey = new PluginKey('trackChanges')

// ---------------------------------------------------------------------------
// Helper: generate a unique-ish id for each tracked change
// ---------------------------------------------------------------------------

function generateChangeId(): string {
  return `tc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ---------------------------------------------------------------------------
// InsertionMark
// ---------------------------------------------------------------------------

export const InsertionMark = MarkExtension.create({
  name: 'insertion',
  markSpec: {
    attrs: {
      author: { default: '' },
      date: { default: '' },
      id: { default: '' },
    },
    parseDOM: [
      {
        tag: 'span[data-type="insertion"]',
        getAttrs: (dom: HTMLElement | string) => {
          const el = dom as HTMLElement
          return {
            author: el.getAttribute('data-author') ?? '',
            date: el.getAttribute('data-date') ?? '',
            id: el.getAttribute('data-id') ?? '',
          }
        },
      },
    ],
    toDOM: (mark) =>
      [
        'span',
        {
          'data-type': 'insertion',
          'data-author': mark.attrs.author as string,
          'data-date': mark.attrs.date as string,
          'data-id': mark.attrs.id as string,
          class: 'verso-insertion',
        },
        0,
      ] as unknown as HTMLElement,
  },
})

// ---------------------------------------------------------------------------
// DeletionMark
// ---------------------------------------------------------------------------

export const DeletionMark = MarkExtension.create({
  name: 'deletion',
  markSpec: {
    attrs: {
      author: { default: '' },
      date: { default: '' },
      id: { default: '' },
    },
    parseDOM: [
      {
        tag: 'span[data-type="deletion"]',
        getAttrs: (dom: HTMLElement | string) => {
          const el = dom as HTMLElement
          return {
            author: el.getAttribute('data-author') ?? '',
            date: el.getAttribute('data-date') ?? '',
            id: el.getAttribute('data-id') ?? '',
          }
        },
      },
    ],
    toDOM: (mark) =>
      [
        'span',
        {
          'data-type': 'deletion',
          'data-author': mark.attrs.author as string,
          'data-date': mark.attrs.date as string,
          'data-id': mark.attrs.id as string,
          class: 'verso-deletion',
        },
        0,
      ] as unknown as HTMLElement,
  },
})

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export interface TrackChangesOptions {
  author: string
  enableTracking: boolean
}

// ---------------------------------------------------------------------------
// TrackChangesExtension
// ---------------------------------------------------------------------------

export const TrackChangesExtension = Extension.create<TrackChangesOptions>({
  name: 'trackChanges',

  defaultOptions: {
    author: 'unknown',
    enableTracking: true,
  },

  plugins: [
    () => {
      return new Plugin({
        key: trackChangesKey,

        appendTransaction(transactions, oldState, newState) {
          const { enableTracking, author } = TrackChangesExtension.options

          if (!enableTracking) return null

          // Bail out if none of the transactions changed the document
          const docChanged = transactions.some((tr) => tr.docChanged)
          if (!docChanged) return null

          // Bail out if this is our own transaction (prevent infinite loops)
          const fromSelf = transactions.some((tr) => tr.getMeta(trackChangesKey) !== undefined)
          if (fromSelf) return null

          const { tr } = newState
          const insertionType = newState.schema.marks.insertion
          const deletionType = newState.schema.marks.deletion

          if (!insertionType || !deletionType) return null

          let modified = false
          const now = new Date().toISOString()
          const changeId = generateChangeId()

          // --- Process each transaction's steps --------------------------------
          for (const transaction of transactions) {
            if (!transaction.docChanged) continue

            // Walk through mapping to detect insertions and deletions
            const mapping = transaction.mapping

            for (let i = 0; i < mapping.maps.length; i++) {
              const map = mapping.maps[i]

              map.forEach((oldStart, oldEnd, newStart, newEnd) => {
                const oldDoc = oldState.doc
                const newDoc = newState.doc

                // ---- Deletion detection: content removed from old doc ------
                if (oldEnd > oldStart && newEnd <= newStart) {
                  const deletedSlice = oldDoc.slice(oldStart, oldEnd)
                  const hasContent = deletedSlice.content.firstChild !== null

                  if (hasContent) {
                    // Instead of deleting, wrap the range in a deletion mark.
                    // We insert the deleted content back and mark it.
                    const insertPos = mapping.map(oldStart)

                    // Check if content at this range isn't already marked as deletion
                    const existingNode = newDoc.nodeAt(Math.min(insertPos, newDoc.content.size - 1))
                    const alreadyDeleted =
                      existingNode?.marks.some((m: ProseMirrorMark) => m.type === deletionType) ??
                      false

                    if (!alreadyDeleted) {
                      // Re-insert the deleted content wrapped in deletion mark
                      const mark = deletionType.create({
                        author,
                        date: now,
                        id: changeId,
                      })

                      // Insert deleted content back at the mapped position
                      tr.insert(insertPos, deletedSlice.content)

                      // Apply deletion mark to the re-inserted content
                      const contentSize = deletedSlice.content.size
                      if (contentSize > 0) {
                        const from = insertPos
                        const to = Math.min(insertPos + contentSize, tr.doc.content.size)
                        tr.addMark(from, to, mark)
                      }

                      modified = true
                    }
                  }
                }

                // ---- Insertion detection: new content added ----------------
                if (newEnd > newStart) {
                  const insertedSize = newEnd - newStart
                  if (insertedSize <= 0) return

                  const nodeAtPos = newDoc.nodeAt(Math.min(newStart, newDoc.content.size - 1))
                  if (!nodeAtPos) return

                  // Only mark text nodes that aren't already tracked
                  const alreadyTracked =
                    nodeAtPos.marks.some((m: ProseMirrorMark) => m.type === insertionType) ||
                    nodeAtPos.marks.some((m: ProseMirrorMark) => m.type === deletionType)

                  if (!alreadyTracked) {
                    const mark = insertionType.create({
                      author,
                      date: now,
                      id: changeId,
                    })

                    const from = newStart
                    const to = Math.min(newEnd, newState.doc.content.size)
                    tr.addMark(from, to, mark)
                    modified = true
                  }
                }
              })
            }
          }

          if (!modified) return null

          tr.setMeta(trackChangesKey, { tracked: true })
          return tr
        },
      })
    },
  ],

  commands: {
    acceptChanges: () => () => {
      // Commands return a factory; the actual execution happens via the
      // exported `acceptChanges` function below which the editor host calls
      // directly with state and dispatch.
      return true
    },
    rejectChanges: () => () => {
      return true
    },
  },
})

// ---------------------------------------------------------------------------
// Public command: acceptChanges
//
// Keeps insertion text (strips the mark), removes deletion text entirely.
// ---------------------------------------------------------------------------

export function acceptChanges(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
  const insertionType = state.schema.marks.insertion
  const deletionType = state.schema.marks.deletion

  if (!insertionType && !deletionType) return false

  const tr = state.tr
  let modified = false

  // Collect all ranges that carry insertion or deletion marks
  const deletionRanges: Array<{ from: number; to: number }> = []

  state.doc.descendants((node, pos) => {
    if (!node.marks || node.marks.length === 0) return

    for (const mark of node.marks) {
      if (insertionType && mark.type === insertionType) {
        // Remove the insertion mark but keep the text
        tr.removeMark(pos, pos + node.nodeSize, insertionType)
        modified = true
      }

      if (deletionType && mark.type === deletionType) {
        // Record deletion ranges for removal (collect first, delete in reverse)
        deletionRanges.push({ from: pos, to: pos + node.nodeSize })
        modified = true
      }
    }
  })

  // Remove deletion-marked content in reverse order to preserve positions
  for (let i = deletionRanges.length - 1; i >= 0; i--) {
    const { from, to } = deletionRanges[i]
    tr.delete(from, to)
  }

  if (!modified) return false

  if (dispatch) {
    dispatch(tr)
  }

  return true
}

// ---------------------------------------------------------------------------
// Public command: rejectChanges
//
// Removes insertion-marked text, keeps deletion-marked text (strips the mark).
// ---------------------------------------------------------------------------

export function rejectChanges(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
  const insertionType = state.schema.marks.insertion
  const deletionType = state.schema.marks.deletion

  if (!insertionType && !deletionType) return false

  const tr = state.tr
  let modified = false

  // Collect all ranges
  const insertionRanges: Array<{ from: number; to: number }> = []

  state.doc.descendants((node, pos) => {
    if (!node.marks || node.marks.length === 0) return

    for (const mark of node.marks) {
      if (deletionType && mark.type === deletionType) {
        // Keep the text but strip the deletion mark
        tr.removeMark(pos, pos + node.nodeSize, deletionType)
        modified = true
      }

      if (insertionType && mark.type === insertionType) {
        // Record insertion ranges for removal
        insertionRanges.push({ from: pos, to: pos + node.nodeSize })
        modified = true
      }
    }
  })

  // Remove insertion-marked content in reverse order to preserve positions
  for (let i = insertionRanges.length - 1; i >= 0; i--) {
    const { from, to } = insertionRanges[i]
    tr.delete(from, to)
  }

  if (!modified) return false

  if (dispatch) {
    dispatch(tr)
  }

  return true
}
