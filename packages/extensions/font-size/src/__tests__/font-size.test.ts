import { describe, expect, it } from 'vitest'
import { FontSizeExtension, setFontSize, unsetFontSize } from '../index'

describe('FontSizeExtension', () => {
  it('has name fontSize', () => {
    expect(FontSizeExtension.name).toBe('fontSize')
  })

  it('has fontSize attr with empty default', () => {
    const attrs = FontSizeExtension.markSpec.attrs as Record<string, { default: string }>
    expect(attrs.fontSize).toBeDefined()
    expect(attrs.fontSize.default).toBe('')
  })

  it('parses <span style="font-size:..."> from HTML', () => {
    const getAttrs = (
      FontSizeExtension.markSpec.parseDOM as {
        tag: string
        getAttrs: (dom: HTMLElement) => unknown
      }[]
    )[0].getAttrs
    const el = document.createElement('span')
    el.setAttribute('style', 'font-size: 24px')
    const result = getAttrs(el)
    expect(result).toEqual({ fontSize: '24px' })
  })

  it('outputs span with font-size style', () => {
    const mark = { attrs: { fontSize: '24px' } }
    const result = FontSizeExtension.markSpec.toDOM?.(mark as never)
    expect(result).toEqual(['span', { style: 'font-size: 24px' }, 0])
  })

  it('exports setFontSize and unsetFontSize commands', () => {
    expect(typeof setFontSize).toBe('function')
    expect(typeof unsetFontSize).toBe('function')
  })
})
