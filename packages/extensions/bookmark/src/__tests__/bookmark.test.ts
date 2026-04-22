import { describe, expect, it } from 'vitest'
import { BookmarkExtension } from '../index'

describe('BookmarkExtension', () => {
  it('has name bookmark', () => {
    expect(BookmarkExtension.name).toBe('bookmark')
  })
  it('has nodeSpec', () => {
    expect(BookmarkExtension.nodeSpec).toBeDefined()
  })
  it('is inline', () => {
    expect(BookmarkExtension.nodeSpec.inline).toBe(true)
  })
  it('is atom', () => {
    expect(BookmarkExtension.nodeSpec.atom).toBe(true)
  })
  it('has id and name attrs', () => {
    expect(BookmarkExtension.nodeSpec.attrs).toHaveProperty('id')
    expect(BookmarkExtension.nodeSpec.attrs).toHaveProperty('name')
  })
})
