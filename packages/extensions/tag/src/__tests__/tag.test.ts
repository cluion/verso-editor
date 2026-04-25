import { Editor } from '@verso-editor/core'
import { describe, expect, it } from 'vitest'
import { TagExtension, getTags, insertTag } from '../index'

describe('TagExtension', () => {
  it('has name tag', () => {
    expect(TagExtension.name).toBe('tag')
  })

  it('has nodeSpec with inline atom definition', () => {
    expect(TagExtension.nodeSpec).toBeDefined()
    expect(TagExtension.nodeSpec.inline).toBe(true)
    expect(TagExtension.nodeSpec.group).toBe('inline')
    expect(TagExtension.nodeSpec.atom).toBe(true)
  })

  it('has id and label attrs', () => {
    const attrs = TagExtension.nodeSpec.attrs as Record<string, unknown>
    expect(attrs.id).toBeDefined()
    expect(attrs.label).toBeDefined()
  })

  it('has parseDOM for span[data-type="tag"]', () => {
    const rules = TagExtension.nodeSpec.parseDOM
    expect(rules).toBeDefined()
    expect(rules?.some((r) => (r as { tag: string }).tag === 'span[data-type="tag"]')).toBe(true)
  })

  it('toDOM outputs tag chip with BEM classes', () => {
    const toDOM = TagExtension.nodeSpec.toDOM
    // biome-ignore lint/suspicious/noExplicitAny: test convenience
    const result = toDOM?.({ attrs: { id: '1', label: 'important' } } as any) as unknown[]
    expect(result).toBeDefined()
    expect(result[0]).toBe('span')
    const attrs = result[1] as Record<string, string>
    expect(attrs.class).toBe('vs-tag')
    expect(attrs['data-type']).toBe('tag')
  })

  it('has nodeView defined', () => {
    expect(TagExtension.nodeView).toBeDefined()
  })

  it('has plugins defined for suggestion', () => {
    expect(TagExtension.plugins).toBeDefined()
    expect(TagExtension.plugins.length).toBeGreaterThan(0)
  })
})

describe('insertTag', () => {
  it('returns a command function', () => {
    const cmd = insertTag('1', 'test')
    expect(typeof cmd).toBe('function')
  })
})

describe('getTags', () => {
  it('returns empty array when no tags in document', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({
      element,
      extensions: [TagExtension],
      content: '<p>Hello world</p>',
    })
    const tags = getTags(editor)
    expect(tags).toEqual([])
    editor.destroy()
    element.remove()
  })

  it('returns tags from document', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({
      element,
      extensions: [TagExtension],
      content:
        '<p><span data-type="tag" data-id="1"><span class="vs-tag__label">#important</span></span> text</p>',
    })
    const tags = getTags(editor)
    expect(tags).toEqual([{ id: '1', label: 'important' }])
    editor.destroy()
    element.remove()
  })
})
