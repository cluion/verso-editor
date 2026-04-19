import { describe, expect, it } from 'vitest'
import { PrintViewExtension } from '../index'

describe('PrintViewExtension', () => {
  it('has name printView', () => {
    expect(PrintViewExtension.name).toBe('printView')
  })

  it('has plugins', () => {
    expect(PrintViewExtension.plugins.length).toBeGreaterThan(0)
  })

  it('has print command', () => {
    expect(PrintViewExtension.commands).toHaveProperty('print')
  })
})
