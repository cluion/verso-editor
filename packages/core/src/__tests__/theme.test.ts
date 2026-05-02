import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThemeManager } from '../theme'

describe('ThemeManager', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    localStorage.clear()
  })

  afterEach(() => {
    container.remove()
    document.documentElement.removeAttribute('data-vs-theme')
  })

  it('defaults to light theme', () => {
    const manager = new ThemeManager(container)
    expect(manager.getTheme()).toBe('light')
    expect(document.documentElement.getAttribute('data-vs-theme')).toBe('light')
    manager.destroy()
  })

  it('sets dark theme via attribute', () => {
    const manager = new ThemeManager(container)
    manager.setTheme('dark')
    expect(document.documentElement.getAttribute('data-vs-theme')).toBe('dark')
    expect(manager.getTheme()).toBe('dark')
    manager.destroy()
  })

  it('sets light attribute explicitly', () => {
    const manager = new ThemeManager(container)
    manager.setTheme('dark')
    manager.setTheme('light')
    expect(document.documentElement.getAttribute('data-vs-theme')).toBe('light')
    manager.destroy()
  })

  it('applies custom overrides as inline styles', () => {
    const manager = new ThemeManager(container)
    manager.setTheme('light', { '--vs-accent': '#e74c3c' })
    expect(document.documentElement.style.getPropertyValue('--vs-accent')).toBe('#e74c3c')
    manager.destroy()
  })

  it('persists theme to localStorage', () => {
    const manager = new ThemeManager(container, { persistTheme: true })
    manager.setTheme('dark')
    expect(localStorage.getItem('verso-editor-theme')).toBe('dark')
    manager.destroy()
  })

  it('restores persisted theme on construction', () => {
    localStorage.setItem('verso-editor-theme', 'dark')
    const manager = new ThemeManager(container, { persistTheme: true })
    expect(manager.getTheme()).toBe('dark')
    manager.destroy()
  })

  it('uses defaultTheme option', () => {
    const manager = new ThemeManager(container, { defaultTheme: 'dark' })
    expect(manager.getTheme()).toBe('dark')
    manager.destroy()
  })

  it('setTheme is chainable', () => {
    const manager = new ThemeManager(container)
    const result = manager.setTheme('dark')
    expect(result).toBe(manager)
    manager.destroy()
  })
})
