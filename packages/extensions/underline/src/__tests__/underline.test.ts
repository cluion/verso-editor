import { describe, expect, it } from 'vitest'
import { UnderlineExtension } from '../index'

describe('UnderlineExtension', () => {
  it('has name underline', () => {
    expect(UnderlineExtension.name).toBe('underline')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(UnderlineExtension.markSpec.parseDOM).toBeDefined()
    expect(UnderlineExtension.markSpec.toDOM).toBeDefined()
  })

  it('parses <u> tag', () => {
    const spec = UnderlineExtension.markSpec
    expect(spec.parseDOM).toEqual([{ tag: 'u' }])
  })

  it('outputs <u> tag', () => {
    const result = ((spec) => spec.toDOM?.())(UnderlineExtension.markSpec)
    expect(result).toEqual(['u', 0])
  })
})
