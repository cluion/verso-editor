import { describe, expect, it } from 'vitest'
import { FileEmbedExtension } from '../index'

describe('FileEmbedExtension', () => {
  it('has name file_embed', () => {
    expect(FileEmbedExtension.name).toBe('file_embed')
  })

  it('has nodeSpec with block group', () => {
    expect(FileEmbedExtension.nodeSpec).toBeDefined()
    expect(FileEmbedExtension.nodeSpec.inline).toBe(false)
    expect(FileEmbedExtension.nodeSpec.group).toBe('block')
  })

  it('has name, url, size, type attrs', () => {
    const attrs = FileEmbedExtension.nodeSpec.attrs
    expect(attrs?.name).toBeDefined()
    expect(attrs?.url).toBeDefined()
    expect(attrs?.size).toBeDefined()
    expect(attrs?.type).toBeDefined()
  })

  it('has parseDOM for div[data-type="file"]', () => {
    const rules = FileEmbedExtension.nodeSpec.parseDOM
    expect(rules?.some((r) => (r as { tag: string }).tag === 'div[data-type="file"]')).toBe(true)
  })

  it('toDOM outputs file card structure', () => {
    const toDOM = FileEmbedExtension.nodeSpec.toDOM
    const result = toDOM?.({
      attrs: { name: 'doc.pdf', url: '/files/doc.pdf', size: '1024', type: 'application/pdf' },
      // biome-ignore lint/suspicious/noExplicitAny: test convenience
    } as any)
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
  })
})
