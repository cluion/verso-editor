import { describe, expect, it } from 'vitest'
import { GapCursorExtension } from '../index'

describe('GapCursorExtension', () => {
  it('has name gapCursor', () => {
    expect(GapCursorExtension.name).toBe('gapCursor')
  })

  it('has a plugin factory', () => {
    expect(GapCursorExtension.plugins).toBeDefined()
    expect(GapCursorExtension.plugins.length).toBeGreaterThan(0)
  })
})
