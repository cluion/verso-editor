import { Plugin } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { createInputRulesPlugin } from '../input-rules'
import { defaultSchema } from '../schema'

describe('createInputRulesPlugin', () => {
  it('returns a ProseMirror plugin', () => {
    const plugin = createInputRulesPlugin(defaultSchema)
    expect(plugin).toBeInstanceOf(Plugin)
  })

  it('plugin has correct key', () => {
    const plugin = createInputRulesPlugin(defaultSchema)
    expect(plugin.spec.key).toBeDefined()
  })
})
