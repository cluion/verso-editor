import { describe, expect, it } from 'vitest'
import { FullscreenExtension } from '../index'

describe('FullscreenExtension', () => {
  it('has name fullscreen', () => {
    expect(FullscreenExtension.name).toBe('fullscreen')
  })
  it('has toggleFullscreen command', () => {
    expect(FullscreenExtension.commands?.toggleFullscreen).toBeDefined()
  })
})
