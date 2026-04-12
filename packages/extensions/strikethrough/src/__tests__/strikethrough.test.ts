import { describe, expect, it } from 'vitest'
import { StrikethroughExtension } from '../index'

describe('StrikethroughExtension', () => {
  it('has name strikethrough', () => {
    expect(StrikethroughExtension.name).toBe('strikethrough')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(StrikethroughExtension.markSpec.parseDOM).toBeDefined()
    expect(StrikethroughExtension.markSpec.toDOM).toBeDefined()
  })

  it('parses <s> and <del> tags', () => {
    const spec = StrikethroughExtension.markSpec
    expect(spec.parseDOM).toEqual([{ tag: 's' }, { tag: 'del' }])
  })

  it('outputs <s> tag', () => {
    const result = StrikethroughExtension.markSpec.toDOM?.()
    expect(result).toEqual(['s', 0])
  })
})
