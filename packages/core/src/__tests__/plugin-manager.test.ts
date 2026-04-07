import { describe, expect, it } from 'vitest'
import { Extension } from '../extension'
import { sortExtensions } from '../plugin-manager'

describe('sortExtensions (topological sort)', () => {
  it('returns all extensions in order when no dependencies', () => {
    const a = Extension.create({ name: 'a' })
    const b = Extension.create({ name: 'b' })
    const result = sortExtensions([a, b])
    expect(result.map((e) => e.name)).toEqual(['a', 'b'])
  })

  it('sorts by dependencies: a depends on b, b depends on c', () => {
    const c = Extension.create({ name: 'c' })
    const b = Extension.create({ name: 'b', dependencies: ['c'] })
    const a = Extension.create({ name: 'a', dependencies: ['b'] })
    const result = sortExtensions([a, b, c])
    expect(result.map((e) => e.name)).toEqual(['c', 'b', 'a'])
  })

  it('throws on circular dependencies', () => {
    const a = Extension.create({ name: 'a', dependencies: ['b'] })
    const b = Extension.create({ name: 'b', dependencies: ['a'] })
    expect(() => sortExtensions([a, b])).toThrow(/circular/i)
  })

  it('throws on missing dependencies', () => {
    const a = Extension.create({ name: 'a', dependencies: ['missing'] })
    expect(() => sortExtensions([a])).toThrow(/missing/i)
  })

  it('handles mixed dependencies and independents', () => {
    const a = Extension.create({ name: 'a' })
    const b = Extension.create({ name: 'b', dependencies: ['a'] })
    const c = Extension.create({ name: 'c' })
    const result = sortExtensions([c, b, a])
    const names = result.map((e) => e.name)
    // a must come before b; c can be anywhere
    expect(names.indexOf('a')).toBeLessThan(names.indexOf('b'))
    expect(names).toHaveLength(3)
  })
})
