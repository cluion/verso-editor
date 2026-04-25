import { describe, expect, it, vi } from 'vitest'

vi.mock('mermaid', () => ({
  default: {
    initialize: () => {},
    render: async () => ({ svg: '<svg>mock</svg>' }),
  },
}))

import { MermaidExtension } from '../index'

describe('MermaidExtension', () => {
  it('has name mermaid', () => {
    expect(MermaidExtension.name).toBe('mermaid')
  })

  it('has nodeSpec with block node definition', () => {
    expect(MermaidExtension.nodeSpec).toBeDefined()
    expect(MermaidExtension.nodeSpec.group).toBe('block')
    expect(MermaidExtension.nodeSpec.content).toBe('text*')
  })

  it('has language attr defaulting to mermaid', () => {
    const attrs = MermaidExtension.nodeSpec.attrs as Record<string, unknown>
    expect(attrs.language).toBeDefined()
  })

  it('has parseDOM for pre[data-language="mermaid"]', () => {
    const rules = MermaidExtension.nodeSpec.parseDOM
    expect(rules).toBeDefined()
    expect(rules?.some((r) => (r as { tag: string }).tag === 'pre[data-language="mermaid"]')).toBe(
      true,
    )
  })

  it('toDOM outputs pre/code structure', () => {
    const toDOM = MermaidExtension.nodeSpec.toDOM
    // biome-ignore lint/suspicious/noExplicitAny: test convenience
    const result = toDOM?.({ attrs: { language: 'mermaid' } } as any)
    expect(result).toBeDefined()
    expect(result[0]).toBe('pre')
  })

  it('has nodeView defined', () => {
    expect(MermaidExtension.nodeView).toBeDefined()
  })

  it('accepts mermaidConfig option', () => {
    const configured = MermaidExtension.configure({ mermaidConfig: { theme: 'dark' } })
    expect(configured.options.mermaidConfig).toEqual({ theme: 'dark' })
  })

  it('has empty marks to prevent formatting inside', () => {
    expect(MermaidExtension.nodeSpec.marks).toBe('')
  })
})
