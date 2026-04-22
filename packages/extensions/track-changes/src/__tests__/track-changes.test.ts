import { describe, expect, it } from 'vitest'
import {
  DeletionMark,
  InsertionMark,
  TrackChangesExtension,
  acceptChanges,
  rejectChanges,
} from '../index'

describe('InsertionMark', () => {
  it('has name insertion', () => {
    expect(InsertionMark.name).toBe('insertion')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(InsertionMark.markSpec.parseDOM).toBeDefined()
    expect(InsertionMark.markSpec.toDOM).toBeDefined()
  })

  it('has author, date, id attrs', () => {
    const attrs = InsertionMark.markSpec.attrs
    expect(attrs).toHaveProperty('author')
    expect(attrs).toHaveProperty('date')
    expect(attrs).toHaveProperty('id')
  })
})

describe('DeletionMark', () => {
  it('has name deletion', () => {
    expect(DeletionMark.name).toBe('deletion')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(DeletionMark.markSpec.parseDOM).toBeDefined()
    expect(DeletionMark.markSpec.toDOM).toBeDefined()
  })

  it('has author, date, id attrs', () => {
    const attrs = DeletionMark.markSpec.attrs
    expect(attrs).toHaveProperty('author')
    expect(attrs).toHaveProperty('date')
    expect(attrs).toHaveProperty('id')
  })
})

describe('TrackChangesExtension', () => {
  it('has name trackChanges', () => {
    expect(TrackChangesExtension.name).toBe('trackChanges')
  })

  it('has default options', () => {
    expect(TrackChangesExtension.options.author).toBe('unknown')
    expect(TrackChangesExtension.options.enableTracking).toBe(true)
  })

  it('has plugins', () => {
    expect(TrackChangesExtension.plugins.length).toBeGreaterThan(0)
  })

  it('has acceptChanges and rejectChanges commands', () => {
    expect(TrackChangesExtension.commands?.acceptChanges).toBeDefined()
    expect(TrackChangesExtension.commands?.rejectChanges).toBeDefined()
  })
})

describe('acceptChanges', () => {
  it('is a function', () => {
    expect(typeof acceptChanges).toBe('function')
  })
})

describe('rejectChanges', () => {
  it('is a function', () => {
    expect(typeof rejectChanges).toBe('function')
  })
})
