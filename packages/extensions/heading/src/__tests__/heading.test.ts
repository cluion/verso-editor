import { describe, expect, it } from 'vitest'
import { HeadingExtension } from '../index'

describe('HeadingExtension', () => {
  it('has name heading', () => {
    expect(HeadingExtension.name).toBe('heading')
  })

  it('has nodeSpec defined', () => {
    expect(HeadingExtension.nodeSpec).toBeDefined()
  })

  it('has default options.levels', () => {
    expect(HeadingExtension.options.levels).toEqual([1, 2, 3, 4, 5, 6])
  })
})
