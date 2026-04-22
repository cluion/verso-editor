import { describe, expect, it } from 'vitest'
import { FormatPainterExtension } from '../index'

describe('FormatPainterExtension', () => {
  it('has name formatPainter', () => {
    expect(FormatPainterExtension.name).toBe('formatPainter')
  })
  it('has plugins', () => {
    expect(FormatPainterExtension.plugins.length).toBeGreaterThan(0)
  })
  it('has keymap', () => {
    expect(FormatPainterExtension.keymap).toBeDefined()
  })
})
