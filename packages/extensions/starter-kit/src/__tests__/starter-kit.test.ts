import { describe, expect, it } from 'vitest'
import { createStarterKit } from '../index'

describe('createStarterKit', () => {
  it('returns all extensions by default', () => {
    const extensions = createStarterKit()
    expect(extensions.length).toBe(14)
  })

  it('excludes extension when set to false', () => {
    const extensions = createStarterKit({ heading: false })
    expect(extensions.length).toBe(13)
    expect(extensions.find((e) => e.name === 'heading')).toBeUndefined()
  })
})
