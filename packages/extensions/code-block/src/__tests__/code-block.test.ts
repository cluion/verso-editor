import { describe, expect, it } from 'vitest'
import { CodeBlockExtension } from '../index'

describe('CodeBlockExtension', () => {
  it('has name code_block', () => {
    expect(CodeBlockExtension.name).toBe('code_block')
  })

  it('has nodeSpec with marks empty string', () => {
    expect(CodeBlockExtension.nodeSpec).toBeDefined()
    expect(CodeBlockExtension.nodeSpec.marks).toBe('')
  })
})
