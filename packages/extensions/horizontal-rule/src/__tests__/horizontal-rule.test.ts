import { describe, expect, it } from 'vitest'
import { HorizontalRuleExtension } from '../index'

describe('HorizontalRuleExtension', () => {
  it('has name horizontal_rule', () => {
    expect(HorizontalRuleExtension.name).toBe('horizontal_rule')
  })

  it('has nodeSpec defined', () => {
    expect(HorizontalRuleExtension.nodeSpec).toBeDefined()
  })
})
