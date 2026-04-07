import { describe, expect, it } from 'vitest'
import { CodeExtension } from '../index'

describe('CodeExtension', () => {
  it('has name code', () => {
    expect(CodeExtension.name).toBe('code')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(CodeExtension.markSpec.parseDOM).toBeDefined()
    expect(CodeExtension.markSpec.toDOM).toBeDefined()
  })
})
