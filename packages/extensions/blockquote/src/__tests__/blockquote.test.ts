import { describe, expect, it } from 'vitest'
import { BlockquoteExtension } from '../index'

describe('BlockquoteExtension', () => {
  it('has name blockquote', () => {
    expect(BlockquoteExtension.name).toBe('blockquote')
  })

  it('has nodeSpec defined', () => {
    expect(BlockquoteExtension.nodeSpec).toBeDefined()
  })
})
