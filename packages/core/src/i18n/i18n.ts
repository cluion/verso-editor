import { en } from './locales/en'
import { zhTW } from './locales/zh-TW'

export type LocaleDictionary = Record<string, string>
export type LocaleChangeHandler = (locale: string) => void

const builtInLocales: Record<string, LocaleDictionary> = {
  en,
  'zh-TW': zhTW,
}

export class I18n {
  private locales = new Map<string, LocaleDictionary>(Object.entries(builtInLocales))
  private currentLocale: string
  private fallbackLocale = 'en'
  private listeners = new Set<LocaleChangeHandler>()

  constructor(locale = 'en') {
    this.currentLocale = locale
  }

  t(key: string, params?: Record<string, string | number>): string {
    const dict = this.locales.get(this.currentLocale) ?? {}
    const fallback = this.locales.get(this.fallbackLocale) ?? {}
    let text = dict[key] ?? fallback[key] ?? key

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      }
    }
    return text
  }

  registerLocale(name: string, translations: LocaleDictionary): this {
    this.locales.set(name, translations)
    return this
  }

  setLocale(name: string): this {
    if (!this.locales.has(name)) {
      throw new Error(`Locale "${name}" is not registered. Use registerLocale() first.`)
    }
    this.currentLocale = name
    for (const handler of this.listeners) {
      handler(name)
    }
    return this
  }

  getLocale(): string {
    return this.currentLocale
  }

  getRegisteredLocales(): string[] {
    return [...this.locales.keys()]
  }

  onChange(handler: LocaleChangeHandler): () => void {
    this.listeners.add(handler)
    return () => {
      this.listeners.delete(handler)
    }
  }
}
