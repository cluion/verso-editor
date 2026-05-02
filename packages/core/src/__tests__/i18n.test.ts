import { describe, expect, it } from 'vitest'
import { I18n } from '../i18n/i18n'

describe('I18n', () => {
  it('defaults to en locale', () => {
    const i18n = new I18n()
    expect(i18n.getLocale()).toBe('en')
  })

  it('uses specified locale on construction', () => {
    const i18n = new I18n('zh-TW')
    expect(i18n.getLocale()).toBe('zh-TW')
  })

  it('translates key from current locale', () => {
    const i18n = new I18n('zh-TW')
    expect(i18n.t('editor.ariaLabel')).toBe('富文本編輯器')
  })

  it('falls back to en when key missing in current locale', () => {
    const i18n = new I18n()
    i18n.registerLocale('ja', {})
    i18n.setLocale('ja')
    expect(i18n.t('editor.ariaLabel')).toBe('Rich text editor')
  })

  it('returns raw key when missing in both locales', () => {
    const i18n = new I18n()
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key')
  })

  it('supports parameterized translation', () => {
    const i18n = new I18n()
    expect(i18n.t('characterCount.label', { count: 150 })).toBe('150 characters')
  })

  it('registerLocale adds new locale', () => {
    const i18n = new I18n()
    i18n.registerLocale('ja', { 'editor.ariaLabel': 'リッチテキストエディタ' })
    i18n.setLocale('ja')
    expect(i18n.t('editor.ariaLabel')).toBe('リッチテキストエディタ')
    expect(i18n.getRegisteredLocales()).toContain('ja')
  })

  it('setLocale throws for unregistered locale', () => {
    const i18n = new I18n()
    expect(() => i18n.setLocale('xx')).toThrow('Locale "xx" is not registered')
  })

  it('setLocale is chainable', () => {
    const i18n = new I18n()
    const result = i18n.setLocale('zh-TW')
    expect(result).toBe(i18n)
  })

  it('registerLocale is chainable', () => {
    const i18n = new I18n()
    const result = i18n.registerLocale('ja', {})
    expect(result).toBe(i18n)
  })

  it('onChange fires when locale changes', () => {
    const i18n = new I18n()
    const calls: string[] = []
    i18n.onChange((locale) => calls.push(locale))
    i18n.setLocale('zh-TW')
    expect(calls).toEqual(['zh-TW'])
  })

  it('onChange unsubscribe stops callbacks', () => {
    const i18n = new I18n()
    const calls: string[] = []
    const unsub = i18n.onChange((locale) => calls.push(locale))
    unsub()
    i18n.setLocale('zh-TW')
    expect(calls).toEqual([])
  })
})
