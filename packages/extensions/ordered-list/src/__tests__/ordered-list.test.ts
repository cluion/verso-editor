import { describe, expect, it } from 'vitest'
import { OrderedListExtension } from '../index'

describe('OrderedListExtension', () => {
  it('has name ordered_list', () => {
    expect(OrderedListExtension.name).toBe('ordered_list')
  })

  it('has nodeSpec defined', () => {
    expect(OrderedListExtension.nodeSpec).toBeDefined()
  })
})
