import { describe, expect, it } from 'vitest'
import { ParagraphExtension } from '../index'

describe('ParagraphExtension', () => {
  it('has name paragraph', () => {
    expect(ParagraphExtension.name).toBe('paragraph')
  })

  it('has nodeSpec defined', () => {
    expect(ParagraphExtension.nodeSpec).toBeDefined()
  })
})
