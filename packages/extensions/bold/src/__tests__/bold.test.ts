import { describe, expect, it } from 'vitest'
import { BoldExtension } from '../index'

describe('BoldExtension', () => {
  it('has name bold', () => {
    expect(BoldExtension.name).toBe('bold')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(BoldExtension.markSpec.parseDOM).toBeDefined()
    expect(BoldExtension.markSpec.toDOM).toBeDefined()
  })
})
