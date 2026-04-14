import { describe, expect, it } from 'vitest'
import { MentionExtension } from '../index'

describe('MentionExtension', () => {
  it('has name mention', () => {
    expect(MentionExtension.name).toBe('mention')
  })

  it('has nodeSpec with inline node definition', () => {
    expect(MentionExtension.nodeSpec).toBeDefined()
    expect(MentionExtension.nodeSpec.inline).toBe(true)
    expect(MentionExtension.nodeSpec.group).toBe('inline')
  })

  it('has id, name, avatar attrs', () => {
    const attrs = MentionExtension.nodeSpec.attrs
    expect(attrs).toBeDefined()
    expect(attrs?.id).toBeDefined()
    expect(attrs?.name).toBeDefined()
    expect(attrs?.avatar).toBeDefined()
  })

  it('has parseDOM for span[data-type="mention"]', () => {
    expect(MentionExtension.nodeSpec.parseDOM).toBeDefined()
    const rules = MentionExtension.nodeSpec.parseDOM
    expect(rules?.some((r) => (r as { tag: string }).tag === 'span[data-type="mention"]')).toBe(
      true,
    )
  })

  it('toDOM outputs mention span', () => {
    const toDOM = MentionExtension.nodeSpec.toDOM
    // biome-ignore lint/suspicious/noExplicitAny: test convenience
    const result = toDOM?.({ attrs: { id: '1', name: 'John', avatar: '' } } as any)
    expect(result).toBeDefined()
  })
})
