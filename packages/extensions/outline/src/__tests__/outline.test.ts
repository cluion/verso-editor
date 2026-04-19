import { describe, expect, it } from 'vitest'
import { OutlineExtension } from '../index'

describe('OutlineExtension', () => {
  it('has name outline', () => {
    expect(OutlineExtension.name).toBe('outline')
  })

  it('has plugins', () => {
    expect(OutlineExtension.plugins.length).toBeGreaterThan(0)
  })
})
