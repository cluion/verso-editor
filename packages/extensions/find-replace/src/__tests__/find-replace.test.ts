import { describe, expect, it } from 'vitest'
import { FindReplaceExtension } from '../index'

describe('FindReplaceExtension', () => {
  it('has name findReplace', () => {
    expect(FindReplaceExtension.name).toBe('findReplace')
  })

  it('has plugins', () => {
    expect(FindReplaceExtension.plugins.length).toBeGreaterThan(0)
  })
})
