import { describe, expect, it } from 'vitest'
import { RtlExtension } from '../index'

describe('RtlExtension', () => {
  it('has name rtl', () => {
    expect(RtlExtension.name).toBe('rtl')
  })

  it('has toggleDir command', () => {
    expect(RtlExtension.commands).toHaveProperty('toggleDir')
  })

  it('has keymap with Mod-Alt-d', () => {
    const map = RtlExtension.keymap?.()
    expect(map).toHaveProperty('Mod-Alt-d')
  })
})
