import { describe, expect, it } from 'vitest'
import { BulletListExtension } from '../index'

describe('BulletListExtension', () => {
  it('has name bullet_list', () => {
    expect(BulletListExtension.name).toBe('bullet_list')
  })

  it('has nodeSpec defined', () => {
    expect(BulletListExtension.nodeSpec).toBeDefined()
  })
})
