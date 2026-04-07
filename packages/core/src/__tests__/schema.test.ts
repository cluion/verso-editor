import { describe, expect, it } from 'vitest'
import { defaultSchema as schema } from '../schema'

describe('schema', () => {
  it('contains required base nodes', () => {
    expect(schema.nodes.doc).toBeDefined()
    expect(schema.nodes.paragraph).toBeDefined()
    expect(schema.nodes.text).toBeDefined()
    expect(schema.nodes.hard_break).toBeDefined()
  })

  it('contains all heading levels h1-h6', () => {
    const heading = schema.nodes.heading
    expect(heading).toBeDefined()
    for (let level = 1; level <= 6; level++) {
      const node = schema.nodes.heading.create({ level })
      expect(node.attrs.level).toBe(level)
    }
  })

  it('contains block nodes', () => {
    expect(schema.nodes.blockquote).toBeDefined()
    expect(schema.nodes.code_block).toBeDefined()
    expect(schema.nodes.horizontal_rule).toBeDefined()
  })

  it('contains list nodes', () => {
    expect(schema.nodes.bullet_list).toBeDefined()
    expect(schema.nodes.ordered_list).toBeDefined()
    expect(schema.nodes.list_item).toBeDefined()
  })

  it('contains inline marks', () => {
    expect(schema.marks.bold).toBeDefined()
    expect(schema.marks.italic).toBeDefined()
    expect(schema.marks.code).toBeDefined()
    expect(schema.marks.link).toBeDefined()
  })

  it('hard_break is inline and not selectable', () => {
    const hb = schema.nodes.hard_break
    expect(hb.spec.inline).toBe(true)
    expect(hb.spec.selectable).toBeFalsy()
  })

  it('code_block disallows marks', () => {
    const cb = schema.nodes.code_block
    expect(cb.spec.marks).toBe('')
  })

  it('link toDOM includes href and title', () => {
    const mark = schema.marks.link.create({ href: 'https://example.com', title: 'Example' })
    const dom = schema.marks.link.spec.toDOM?.(mark) as unknown as Record<string, unknown>
    expect(dom[0]).toBe('a')
    const attrs = dom[1] as Record<string, string>
    expect(attrs.href).toBe('https://example.com')
    expect(attrs.title).toBe('Example')
  })

  it('link rejects javascript: protocol in parseDOM', () => {
    const el = document.createElement('a')
    el.setAttribute('href', 'javascript:alert(1)')
    const rule = schema.marks.link.spec.parseDOM?.[0] as {
      getAttrs: (dom: HTMLElement) => unknown
    }
    const result = rule.getAttrs?.(el)
    expect(result).toBe(false)
  })

  it('link rejects mixed-case and encoded dangerous protocols', () => {
    const rule = schema.marks.link.spec.parseDOM?.[0] as {
      getAttrs: (dom: HTMLElement) => unknown
    }

    const el1 = document.createElement('a')
    el1.setAttribute('href', 'JaVaScRiPt:alert(1)')
    expect(rule.getAttrs?.(el1)).toBe(false)

    const el2 = document.createElement('a')
    el2.setAttribute('href', 'data:text/html,<script>alert(1)</script>')
    expect(rule.getAttrs?.(el2)).toBe(false)

    const el3 = document.createElement('a')
    el3.setAttribute('href', 'vbscript:msgbox')
    expect(rule.getAttrs?.(el3)).toBe(false)
  })
})
