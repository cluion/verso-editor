export type ThemeName = 'light' | 'dark' | string

export interface ThemeOptions {
  defaultTheme?: ThemeName
  persistTheme?: boolean
}

const STORAGE_KEY = 'verso-editor-theme'

export class ThemeManager {
  private container: HTMLElement
  private currentTheme: ThemeName
  private readonly persist: boolean
  private mediaQuery: MediaQueryList | null = null
  private mediaHandler: ((e: MediaQueryListEvent) => void) | null = null

  constructor(_container: HTMLElement, options?: ThemeOptions) {
    this.container = document.documentElement
    this.persist = options?.persistTheme ?? false
    this.currentTheme = options?.defaultTheme ?? this.detectInitialTheme()
    this.apply(this.currentTheme)

    if (!options?.defaultTheme) {
      this.watchSystemPreference()
    }

    if (this.persist) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        this.setTheme(saved)
      }
    }
  }

  setTheme(name: ThemeName, overrides?: Record<string, string>): this {
    this.currentTheme = name
    this.apply(name, overrides)

    if (this.persist) {
      localStorage.setItem(STORAGE_KEY, name)
    }

    return this
  }

  getTheme(): ThemeName {
    return this.currentTheme
  }

  destroy(): void {
    if (this.mediaQuery && this.mediaHandler) {
      this.mediaQuery.removeEventListener('change', this.mediaHandler)
      this.mediaQuery = null
      this.mediaHandler = null
    }
  }

  private apply(name: ThemeName, overrides?: Record<string, string>): void {
    this.container.setAttribute('data-vs-theme', name)

    if (overrides) {
      for (const [key, value] of Object.entries(overrides)) {
        this.container.style.setProperty(key, value)
      }
    }
  }

  private detectInitialTheme(): ThemeName {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }

  private watchSystemPreference(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.mediaHandler = (e: MediaQueryListEvent) => {
      if (!this.persist || !localStorage.getItem(STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light')
      }
    }
    this.mediaQuery.addEventListener('change', this.mediaHandler)
  }
}
