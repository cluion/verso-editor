import { describe, expect, it } from 'vitest'
import { FontFamilyExtension, setFontFamily, unsetFontFamily } from '../index'

describe('FontFamilyExtension', () => {
  it('has name fontFamily', () => {
    expect(FontFamilyExtension.name).toBe('fontFamily')
  })

  it('has fontFamily attr with empty default', () => {
    const attrs = FontFamilyExtension.markSpec.attrs as Record<string, { default: string }>
    expect(attrs.fontFamily).toBeDefined()
    expect(attrs.fontFamily.default).toBe('')
  })

  it('parses <span style="font-family:..."> from HTML', () => {
    const getAttrs = (
      FontFamilyExtension.markSpec.parseDOM as {
        tag: string
        getAttrs: (dom: HTMLElement) => unknown
      }[]
    )[0].getAttrs
    const el = document.createElement('span')
    el.setAttribute('style', 'font-family: Arial')
    const result = getAttrs(el)
    expect(result).toEqual({ fontFamily: 'Arial' })
  })

  it('outputs span with font-family style', () => {
    const mark = { attrs: { fontFamily: 'Arial' } }
    const result = FontFamilyExtension.markSpec.toDOM?.(mark as never)
    expect(result).toEqual(['span', { style: 'font-family: Arial' }, 0])
  })

  it('exports setFontFamily and unsetFontFamily commands', () => {
    expect(typeof setFontFamily).toBe('function')
    expect(typeof unsetFontFamily).toBe('function')
  })
})
