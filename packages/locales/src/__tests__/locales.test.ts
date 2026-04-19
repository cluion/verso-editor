import { describe, expect, it } from 'vitest'
import { getLocaleMessages, locales } from '../index'

describe('@verso-editor/locales', () => {
  it('returns English locale by default', () => {
    const en = getLocaleMessages('en')
    expect(en['toolbar.bold']).toBe('Bold')
    expect(en['editor.placeholder']).toBe('Start typing...')
  })

  it('returns zh-TW locale', () => {
    const zhTW = getLocaleMessages('zh-TW')
    expect(zhTW['toolbar.bold']).toBe('粗體')
    expect(zhTW['find.noResults']).toBe('沒有結果')
  })

  it('returns ja locale', () => {
    const ja = getLocaleMessages('ja')
    expect(ja['toolbar.bold']).toBe('太字')
    expect(ja['outline.empty']).toBe('見出しなし')
  })

  it('falls back to English for unknown locale', () => {
    const unknown = getLocaleMessages('fr')
    expect(unknown['toolbar.bold']).toBe('Bold')
  })

  it('all locales have the same keys', () => {
    const enKeys = Object.keys(locales.en).sort()
    const zhTWKeys = Object.keys(locales['zh-TW']).sort()
    const jaKeys = Object.keys(locales.ja).sort()
    expect(zhTWKeys).toEqual(enKeys)
    expect(jaKeys).toEqual(enKeys)
  })

  it('supports parameter interpolation in results', () => {
    const en = getLocaleMessages('en')
    expect(en['find.results']).toContain('{count}')
    const zhTW = getLocaleMessages('zh-TW')
    expect(zhTW['find.results']).toContain('{count}')
  })
})
