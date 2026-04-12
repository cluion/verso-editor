import { describe, expect, it } from 'vitest'
import { SuperscriptExtension } from '../index'

describe('SuperscriptExtension', () => {
  it('has name superscript', () => {
    expect(SuperscriptExtension.name).toBe('superscript')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(SuperscriptExtension.markSpec.parseDOM).toBeDefined()
    expect(SuperscriptExtension.markSpec.toDOM).toBeDefined()
  })

  it('parses <sup> tag', () => {
    expect(SuperscriptExtension.markSpec.parseDOM).toEqual([{ tag: 'sup' }])
  })

  it('outputs <sup> tag', () => {
    expect(SuperscriptExtension.markSpec.toDOM?.()).toEqual(['sup', 0])
  })
})
