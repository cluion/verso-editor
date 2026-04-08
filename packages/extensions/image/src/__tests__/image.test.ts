import { describe, expect, it } from 'vitest'
import { ImageExtension } from '../index'

describe('ImageExtension', () => {
  it('has name image', () => {
    expect(ImageExtension.name).toBe('image')
  })

  it('has nodeSpec with src/alt/title attrs', () => {
    expect(ImageExtension.nodeSpec).toBeDefined()
    expect(ImageExtension.nodeSpec.attrs).toBeDefined()
    expect(ImageExtension.nodeSpec.inline).toBe(true)
    expect(ImageExtension.nodeSpec.draggable).toBe(true)
  })
})
