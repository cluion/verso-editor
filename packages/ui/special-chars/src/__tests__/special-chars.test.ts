import { describe, expect, it } from 'vitest'
import { getCharCategories, getSpecialChars } from '../index'

describe('@verso-editor/ui-special-chars', () => {
  it('returns all characters without filter', () => {
    const all = getSpecialChars()
    expect(all.length).toBeGreaterThan(30)
  })

  it('filters by category', () => {
    const math = getSpecialChars('math')
    expect(math.length).toBeGreaterThan(0)
    expect(math.every((c) => c.category === 'math')).toBe(true)
    expect(math.some((c) => c.char === '±')).toBe(true)
  })

  it('returns empty for unknown category', () => {
    expect(getSpecialChars('nonexistent')).toEqual([])
  })

  it('returns correct categories', () => {
    const cats = getCharCategories()
    expect(cats).toEqual(['math', 'currency', 'arrows', 'punctuation', 'symbols'])
  })

  it('each char has required fields', () => {
    for (const c of getSpecialChars()) {
      expect(c.char.length).toBeGreaterThan(0)
      expect(c.name).toBeTruthy()
      expect(c.category).toBeTruthy()
    }
  })
})
