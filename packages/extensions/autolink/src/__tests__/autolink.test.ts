import { describe, expect, it } from 'vitest'
import { AutolinkExtension } from '../index'

describe('AutolinkExtension', () => {
  it('has name autolink', () => {
    expect(AutolinkExtension.name).toBe('autolink')
  })

  it('has a plugin factory', () => {
    expect(AutolinkExtension.plugins).toBeDefined()
    expect(AutolinkExtension.plugins.length).toBeGreaterThan(0)
  })

  it('has default options with linkExtensionName', () => {
    expect(AutolinkExtension.options.linkExtensionName).toBe('link')
  })
})
