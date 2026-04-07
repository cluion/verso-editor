import { describe, expect, it } from 'vitest'
import { Extension, MarkExtension, NodeExtension } from '../extension'

describe('Extension', () => {
  it('has a name', () => {
    const ext = Extension.create({ name: 'test' })
    expect(ext.name).toBe('test')
  })

  it('merges default options with user options', () => {
    const ext = Extension.create({
      name: 'test',
      defaultOptions: { color: 'red', size: 10 },
      options: { size: 20 },
    })
    expect(ext.options).toEqual({ color: 'red', size: 20 })
  })

  it('returns default options when no user options provided', () => {
    const ext = Extension.create({
      name: 'test',
      defaultOptions: { color: 'red' },
    })
    expect(ext.options).toEqual({ color: 'red' })
  })

  it('configure returns new instance without mutating original', () => {
    const ext = Extension.create({
      name: 'test',
      defaultOptions: { level: 1 },
    })
    const configured = ext.configure({ level: 3 })
    expect(configured.options).toEqual({ level: 3 })
    expect(ext.options).toEqual({ level: 1 })
    expect(configured).not.toBe(ext)
  })

  it('configure preserves name', () => {
    const ext = Extension.create({ name: 'test' })
    const configured = ext.configure({})
    expect(configured.name).toBe('test')
  })

  it('has empty options by default', () => {
    const ext = Extension.create({ name: 'test' })
    expect(ext.options).toEqual({})
  })
})

describe('NodeExtension', () => {
  it('carries nodeSpec', () => {
    const spec = {
      content: 'inline*',
      toDOM: () => ['p', 0] as const,
    }
    const ext = NodeExtension.create({
      name: 'paragraph',
      nodeSpec: spec,
    })
    expect(ext.nodeSpec).toBe(spec)
  })

  it('has empty dependencies by default', () => {
    const ext = NodeExtension.create({ name: 'paragraph', nodeSpec: {} })
    expect(ext.dependencies).toEqual([])
  })

  it('accepts dependencies', () => {
    const ext = NodeExtension.create({
      name: 'heading',
      nodeSpec: {},
      dependencies: ['paragraph'],
    })
    expect(ext.dependencies).toEqual(['paragraph'])
  })
})

describe('MarkExtension', () => {
  it('carries markSpec', () => {
    const spec = {
      parseDOM: [{ tag: 'strong' }],
      toDOM: () => ['strong', 0] as const,
    }
    const ext = MarkExtension.create({
      name: 'bold',
      markSpec: spec,
    })
    expect(ext.markSpec).toBe(spec)
  })

  it('has empty dependencies by default', () => {
    const ext = MarkExtension.create({ name: 'bold', markSpec: {} })
    expect(ext.dependencies).toEqual([])
  })
})
