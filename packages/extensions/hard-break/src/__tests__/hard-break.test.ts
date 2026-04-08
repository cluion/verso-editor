import { describe, expect, it } from 'vitest'
import { HardBreakExtension } from '../index'

describe('HardBreakExtension', () => {
  it('has name hard_break', () => {
    expect(HardBreakExtension.name).toBe('hard_break')
  })

  it('has nodeSpec defined', () => {
    expect(HardBreakExtension.nodeSpec).toBeDefined()
  })
})
