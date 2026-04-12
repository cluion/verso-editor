import { describe, expect, it } from 'vitest'
import { TextColorExtension, setTextColor, unsetTextColor } from '../index'

describe('TextColorExtension', () => {
  it('has name textColor', () => {
    expect(TextColorExtension.name).toBe('textColor')
  })

  it('has color attr with empty default', () => {
    const attrs = TextColorExtension.markSpec.attrs as Record<string, { default: string }>
    expect(attrs.color).toBeDefined()
    expect(attrs.color.default).toBe('')
  })

  it('parses <span style="color:..."> from HTML', () => {
    const getAttrs = (
      TextColorExtension.markSpec.parseDOM as {
        tag: string
        getAttrs: (dom: HTMLElement) => unknown
      }[]
    )[0].getAttrs
    const el = document.createElement('span')
    el.setAttribute('style', 'color: #ff0000')
    const result = getAttrs(el)
    expect(result).toEqual({ color: '#ff0000' })
  })

  it('returns false for span without color style', () => {
    const getAttrs = (
      TextColorExtension.markSpec.parseDOM as {
        tag: string
        getAttrs: (dom: HTMLElement) => unknown
      }[]
    )[0].getAttrs
    const el = document.createElement('span')
    el.setAttribute('style', 'font-weight: bold')
    const result = getAttrs(el)
    expect(result).toBe(false)
  })

  it('outputs span with color style', () => {
    const mark = { attrs: { color: '#ff0000' } }
    const result = TextColorExtension.markSpec.toDOM?.(mark as never)
    expect(result).toEqual(['span', { style: 'color: #ff0000' }, 0])
  })

  it('exports setTextColor and unsetTextColor commands', () => {
    expect(typeof setTextColor).toBe('function')
    expect(typeof unsetTextColor).toBe('function')
  })
})
