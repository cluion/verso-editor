type LocaleDictionary = Record<string, string>

let currentLocale = 'en'
let messages: LocaleDictionary = {}

export function setLocale(locale: string, localeMessages: Record<string, string>): void {
  currentLocale = locale
  messages = localeMessages
}

export function getLocale(): string {
  return currentLocale
}

export function t(key: string, params?: Record<string, string | number>): string {
  let text = messages[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }
  return text
}
