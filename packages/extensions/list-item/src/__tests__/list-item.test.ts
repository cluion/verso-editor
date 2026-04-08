import { describe, expect, it } from 'vitest'
import { ListItemExtension } from '../index'

describe('ListItemExtension', () => {
  it('has name list_item', () => {
    expect(ListItemExtension.name).toBe('list_item')
  })

  it('has nodeSpec defined', () => {
    expect(ListItemExtension.nodeSpec).toBeDefined()
  })
})
