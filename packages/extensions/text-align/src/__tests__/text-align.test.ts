import { describe, expect, it } from 'vitest'
import { TextAlignExtension, setTextAlign } from '../index'

describe('TextAlignExtension', () => {
  it('has name textAlign', () => {
    expect(TextAlignExtension.name).toBe('textAlign')
  })

  it('exports setTextAlign command', () => {
    expect(typeof setTextAlign).toBe('function')
  })

  it('setTextAlign returns a command function', () => {
    const cmd = setTextAlign('center')
    expect(typeof cmd).toBe('function')
  })
})
