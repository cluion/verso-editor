import { describe, expect, it } from 'vitest'
import { PlaceholderExtension } from '../index'

describe('PlaceholderExtension', () => {
  it('has name placeholder', () => {
    expect(PlaceholderExtension.name).toBe('placeholder')
  })

  it('has default placeholder option', () => {
    expect(PlaceholderExtension.options.placeholder).toBe('Start typing...')
  })
})
