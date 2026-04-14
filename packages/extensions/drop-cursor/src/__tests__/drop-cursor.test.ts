import { describe, expect, it } from 'vitest'
import { DropCursorExtension } from '../index'

describe('DropCursorExtension', () => {
  it('has name dropCursor', () => {
    expect(DropCursorExtension.name).toBe('dropCursor')
  })

  it('has a plugin factory', () => {
    expect(DropCursorExtension.plugins).toBeDefined()
    expect(DropCursorExtension.plugins.length).toBeGreaterThan(0)
  })

  it('has default options for color and width', () => {
    expect(DropCursorExtension.options.color).toBe('#000')
    expect(DropCursorExtension.options.width).toBe(2)
  })
})
