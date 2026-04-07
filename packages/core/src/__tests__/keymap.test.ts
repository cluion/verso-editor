import { Plugin } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { createKeymapPlugins } from '../keymap'
import { defaultSchema } from '../schema'

describe('createKeymapPlugins', () => {
  it('returns array of plugins with baseKeymap last', () => {
    const plugins = createKeymapPlugins(defaultSchema)
    expect(plugins.length).toBeGreaterThanOrEqual(2)
    expect(plugins[plugins.length - 1]).toBeInstanceOf(Plugin)
  })

  it('includes at least 3 layers', () => {
    const plugins = createKeymapPlugins(defaultSchema)
    // history keymap + formatting keymap + baseKeymap
    expect(plugins.length).toBeGreaterThanOrEqual(3)
  })
})
