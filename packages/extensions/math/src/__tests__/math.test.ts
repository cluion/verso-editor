import { describe, expect, it } from 'vitest'
import { MathExtension } from '../index'

describe('MathExtension', () => {
  it('has name math', () => {
    expect(MathExtension.name).toBe('math')
  })

  it('has nodeSpec with inline group', () => {
    expect(MathExtension.nodeSpec.group).toBe('inline')
    expect(MathExtension.nodeSpec.inline).toBe(true)
  })

  it('has latex and inline attrs', () => {
    const attrs = MathExtension.nodeSpec.attrs as Record<string, unknown>
    expect(attrs).toHaveProperty('latex')
    expect(attrs).toHaveProperty('inline')
  })

  it('has toDOM and parseDOM', () => {
    expect(MathExtension.nodeSpec.toDOM).toBeDefined()
    expect(MathExtension.nodeSpec.parseDOM).toBeDefined()
  })

  it('has inputRules factory', () => {
    expect(MathExtension.inputRules).toBeDefined()
    const rules = MathExtension.inputRules?.()
    expect(Array.isArray(rules)).toBe(true)
    expect(rules.length).toBe(2)
  })
})
