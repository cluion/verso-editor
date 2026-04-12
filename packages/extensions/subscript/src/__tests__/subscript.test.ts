import { describe, expect, it } from 'vitest'
import { SubscriptExtension } from '../index'

describe('SubscriptExtension', () => {
  it('has name subscript', () => {
    expect(SubscriptExtension.name).toBe('subscript')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(SubscriptExtension.markSpec.parseDOM).toBeDefined()
    expect(SubscriptExtension.markSpec.toDOM).toBeDefined()
  })

  it('parses <sub> tag', () => {
    expect(SubscriptExtension.markSpec.parseDOM).toEqual([{ tag: 'sub' }])
  })

  it('outputs <sub> tag', () => {
    expect(SubscriptExtension.markSpec.toDOM?.()).toEqual(['sub', 0])
  })
})
