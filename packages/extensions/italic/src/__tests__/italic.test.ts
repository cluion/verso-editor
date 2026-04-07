import { describe, expect, it } from 'vitest'
import { ItalicExtension } from '../index'

describe('ItalicExtension', () => {
  it('has name italic', () => {
    expect(ItalicExtension.name).toBe('italic')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(ItalicExtension.markSpec.parseDOM).toBeDefined()
    expect(ItalicExtension.markSpec.toDOM).toBeDefined()
  })
})
