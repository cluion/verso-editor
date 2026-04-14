import { describe, expect, it } from 'vitest'
import { TypographyExtension } from '../index'

describe('TypographyExtension', () => {
  it('has name typography', () => {
    expect(TypographyExtension.name).toBe('typography')
  })

  it('has inputRules factory', () => {
    expect(TypographyExtension.inputRules).toBeDefined()
  })

  it('has default options for all replacements', () => {
    const opts = TypographyExtension.options
    expect(opts.openDoubleQuote).toBe('\u201C')
    expect(opts.closeDoubleQuote).toBe('\u201D')
    expect(opts.emDash).toBe('\u2014')
    expect(opts.ellipsis).toBe('\u2026')
    expect(opts.rightArrow).toBe('\u2192')
    expect(opts.leftArrow).toBe('\u2190')
    expect(opts.smartQuotes).toBe(true)
    expect(opts.dashes).toBe(true)
    expect(opts.ellipsisEnabled).toBe(true)
    expect(opts.arrows).toBe(true)
  })

  it('can disable features via options', () => {
    const configured = TypographyExtension.configure({ smartQuotes: false })
    expect(configured.options.smartQuotes).toBe(false)
  })
})
