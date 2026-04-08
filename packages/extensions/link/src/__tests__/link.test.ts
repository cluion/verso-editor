import { describe, expect, it } from 'vitest'
import { LinkExtension } from '../index'

describe('LinkExtension', () => {
  it('has name link', () => {
    expect(LinkExtension.name).toBe('link')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(LinkExtension.markSpec).toBeDefined()
    expect(LinkExtension.markSpec.parseDOM).toBeDefined()
    expect(LinkExtension.markSpec.toDOM).toBeDefined()
  })
})
