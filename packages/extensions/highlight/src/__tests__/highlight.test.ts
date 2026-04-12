import { describe, expect, it } from 'vitest'
import { HighlightExtension, toggleHighlight } from '../index'

describe('HighlightExtension', () => {
  it('has name highlight', () => {
    expect(HighlightExtension.name).toBe('highlight')
  })

  it('has color attr with empty default', () => {
    const attrs = HighlightExtension.markSpec.attrs as Record<string, { default: string }>
    expect(attrs.color).toBeDefined()
    expect(attrs.color.default).toBe('')
  })

  it('parses <mark> without color', () => {
    const getAttrs = (
      HighlightExtension.markSpec.parseDOM as {
        tag: string
        getAttrs: (dom: HTMLElement) => unknown
      }[]
    )[0].getAttrs
    const el = document.createElement('mark')
    const result = getAttrs(el)
    expect(result).toEqual({ color: '' })
  })

  it('parses <mark style="background-color:..."> from HTML', () => {
    const getAttrs = (
      HighlightExtension.markSpec.parseDOM as {
        tag: string
        getAttrs: (dom: HTMLElement) => unknown
      }[]
    )[0].getAttrs
    const el = document.createElement('mark')
    el.setAttribute('style', 'background-color: #ffc078')
    const result = getAttrs(el)
    expect(result).toEqual({ color: '#ffc078' })
  })

  it('outputs <mark> without style when no color', () => {
    const mark = { attrs: { color: '' } }
    const result = HighlightExtension.markSpec.toDOM?.(mark as never)
    expect(result).toEqual(['mark', 0])
  })

  it('outputs <mark style="background-color:..."> with color', () => {
    const mark = { attrs: { color: '#ffc078' } }
    const result = HighlightExtension.markSpec.toDOM?.(mark as never)
    expect(result).toEqual(['mark', { style: 'background-color: #ffc078' }, 0])
  })

  it('exports toggleHighlight command', () => {
    expect(typeof toggleHighlight).toBe('function')
  })
})
