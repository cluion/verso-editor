import { describe, expect, it } from 'vitest'
import { RevisionHistory, compareSnapshots, createSnapshot } from '../revision'

describe('createSnapshot', () => {
  it('creates a snapshot with id and timestamp', () => {
    const mockDoc = {
      toJSON: () => ({ type: 'doc', content: [{ type: 'paragraph' }] }),
    } as never
    const snapshot = createSnapshot(mockDoc)
    expect(snapshot.id).toMatch(/^rev-\d+$/)
    expect(snapshot.timestamp).toBeGreaterThan(0)
    expect(snapshot.doc).toEqual({ type: 'doc', content: [{ type: 'paragraph' }] })
  })
})

describe('compareSnapshots', () => {
  it('returns zero diff for identical snapshots', () => {
    const doc = { type: 'doc', content: [{ type: 'text', text: 'hello' }] }
    const a = { id: '1', timestamp: 0, doc }
    const b = { id: '2', timestamp: 0, doc }
    expect(compareSnapshots(a, b)).toEqual({ added: 0, removed: 0, changed: 0 })
  })

  it('detects additions', () => {
    const a = {
      id: '1',
      timestamp: 0,
      doc: { type: 'doc', content: [{ type: 'paragraph', content: [] }] },
    }
    const b = {
      id: '2',
      timestamp: 0,
      doc: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'new' }] }],
      },
    }
    const diff = compareSnapshots(a, b)
    expect(diff.changed).toBeGreaterThan(0)
  })
})

describe('RevisionHistory', () => {
  it('stores and retrieves snapshots', () => {
    const history = new RevisionHistory()
    const snapshot = { id: 'rev-1', timestamp: Date.now(), doc: { type: 'doc' } }
    history.add(snapshot)
    expect(history.length).toBe(1)
    expect(history.getAll()).toEqual([snapshot])
  })

  it('compares two revisions', () => {
    const history = new RevisionHistory()
    history.add({
      id: 'rev-1',
      timestamp: 0,
      doc: { type: 'doc', content: [{ type: 'text', text: 'hello' }] },
    })
    history.add({
      id: 'rev-2',
      timestamp: 0,
      doc: { type: 'doc', content: [{ type: 'text', text: 'world' }] },
    })
    const diff = history.compare(0, 1)
    expect(diff).not.toBeNull()
    expect(diff?.changed).toBeGreaterThan(0)
  })

  it('returns null for invalid indices', () => {
    const history = new RevisionHistory()
    expect(history.compare(0, 1)).toBeNull()
  })
})
