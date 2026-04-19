import { describe, expect, it } from 'vitest'
import {
  FootnoteItemExtension,
  FootnoteReferenceExtension,
  FootnoteSectionExtension,
  FootnotesPlugin,
} from '../index'

describe('FootnoteReferenceExtension', () => {
  it('has name footnoteReference', () => {
    expect(FootnoteReferenceExtension.name).toBe('footnoteReference')
  })

  it('is inline', () => {
    expect(FootnoteReferenceExtension.nodeSpec.inline).toBe(true)
    expect(FootnoteReferenceExtension.nodeSpec.group).toBe('inline')
  })

  it('has id and number attrs', () => {
    const attrs = FootnoteReferenceExtension.nodeSpec.attrs as Record<string, unknown>
    expect(attrs).toHaveProperty('id')
    expect(attrs).toHaveProperty('number')
  })
})

describe('FootnoteSectionExtension', () => {
  it('has name footnoteSection', () => {
    expect(FootnoteSectionExtension.name).toBe('footnoteSection')
  })
})

describe('FootnoteItemExtension', () => {
  it('has name footnoteItem', () => {
    expect(FootnoteItemExtension.name).toBe('footnoteItem')
  })
})

describe('FootnotesPlugin', () => {
  it('has name footnotes', () => {
    expect(FootnotesPlugin.name).toBe('footnotes')
  })

  it('has plugins', () => {
    expect(FootnotesPlugin.plugins.length).toBeGreaterThan(0)
  })
})
