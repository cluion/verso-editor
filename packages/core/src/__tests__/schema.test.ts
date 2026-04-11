import { DOMParser } from 'prosemirror-model'
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
    const dom = schema.marks.link.spec.toDOM?.(mark, true) as unknown as Record<string, unknown>
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

describe('parseDOM', () => {
  function parseHTML(html: string) {
    const div = document.createElement('div')
    // html comes from test literals only — safe by construction
    div.innerHTML = html
    return DOMParser.fromSchema(schema).parse(div)
  }

  it('parses paragraph', () => {
    const doc = parseHTML('<p>Hello</p>')
    expect(doc.firstChild?.type.name).toBe('paragraph')
    expect(doc.textContent).toBe('Hello')
  })

  it('parses heading levels h1-h6', () => {
    for (let level = 1; level <= 6; level++) {
      const doc = parseHTML(`<h${level}>Heading</h${level}>`)
      expect(doc.firstChild?.type.name).toBe('heading')
      expect((doc.firstChild?.attrs as { level: number }).level).toBe(level)
    }
  })

  it('parses bold via <strong> and <b>', () => {
    const doc1 = parseHTML('<p><strong>bold</strong></p>')
    expect(doc1.firstChild?.firstChild?.marks.some((m) => m.type.name === 'bold')).toBe(true)

    const doc2 = parseHTML('<p><b>bold</b></p>')
    expect(doc2.firstChild?.firstChild?.marks.some((m) => m.type.name === 'bold')).toBe(true)
  })

  it('parses italic via <em> and <i>', () => {
    const doc1 = parseHTML('<p><em>italic</em></p>')
    expect(doc1.firstChild?.firstChild?.marks.some((m) => m.type.name === 'italic')).toBe(true)

    const doc2 = parseHTML('<p><i>italic</i></p>')
    expect(doc2.firstChild?.firstChild?.marks.some((m) => m.type.name === 'italic')).toBe(true)
  })

  it('parses inline code via <code>', () => {
    const doc = parseHTML('<p><code>code</code></p>')
    expect(doc.firstChild?.firstChild?.marks.some((m) => m.type.name === 'code')).toBe(true)
  })

  it('parses link with href', () => {
    const doc = parseHTML('<p><a href="https://example.com">link</a></p>')
    const linkMark = doc.firstChild?.firstChild?.marks.find((m) => m.type.name === 'link')
    expect(linkMark).toBeDefined()
    expect((linkMark?.attrs as { href: string }).href).toBe('https://example.com')
  })

  it('parses blockquote', () => {
    const doc = parseHTML('<blockquote><p>quoted</p></blockquote>')
    expect(doc.firstChild?.type.name).toBe('blockquote')
  })

  it('parses bullet list', () => {
    const doc = parseHTML('<ul><li><p>item</p></li></ul>')
    expect(doc.firstChild?.type.name).toBe('bullet_list')
  })

  it('parses ordered list with start attribute', () => {
    const doc = parseHTML('<ol start="3"><li><p>item</p></li></ol>')
    expect(doc.firstChild?.type.name).toBe('ordered_list')
    expect((doc.firstChild?.attrs as { order: number }).order).toBe(3)
  })

  it('parses horizontal rule', () => {
    const doc = parseHTML('<hr>')
    const hrNode = doc.content.child(0)
    expect(hrNode.type.name).toBe('horizontal_rule')
  })

  it('parses code block via <pre>', () => {
    const doc = parseHTML('<pre><code>code block</code></pre>')
    expect(doc.firstChild?.type.name).toBe('code_block')
  })
})

describe('toDOM', () => {
  function serializeNode(type: string, attrs?: Record<string, unknown>): unknown {
    const nodeType = schema.nodes[type as keyof typeof schema.nodes]
    const node = nodeType.create(attrs)
    return nodeType.spec.toDOM?.(node)
  }

  it('paragraph toDOM returns ["p", 0]', () => {
    expect(serializeNode('paragraph')).toEqual(['p', 0])
  })

  it('heading toDOM returns correct tag based on level', () => {
    for (let level = 1; level <= 6; level++) {
      const dom = serializeNode('heading', { level }) as ReturnType<typeof serializeNode>
      expect((dom as unknown[])[0]).toBe(`h${level}`)
    }
  })

  it('blockquote toDOM returns ["blockquote", 0]', () => {
    expect(serializeNode('blockquote')).toEqual(['blockquote', 0])
  })

  it('code_block toDOM returns ["pre", ["code", 0]]', () => {
    expect(serializeNode('code_block')).toEqual(['pre', ['code', 0]])
  })

  it('horizontal_rule toDOM returns ["hr"]', () => {
    expect(serializeNode('horizontal_rule')).toEqual(['hr'])
  })

  it('bullet_list toDOM returns ["ul", 0]', () => {
    expect(serializeNode('bullet_list')).toEqual(['ul', 0])
  })

  it('ordered_list toDOM with default order returns ["ol", 0]', () => {
    expect(serializeNode('ordered_list', { order: 1 })).toEqual(['ol', 0])
  })

  it('ordered_list toDOM with start order returns ["ol", {start}, 0]', () => {
    const dom = serializeNode('ordered_list', { order: 5 }) as unknown[]
    expect(dom[0]).toBe('ol')
    expect((dom[1] as Record<string, unknown>).start).toBe(5)
  })

  it('list_item toDOM returns ["li", 0]', () => {
    expect(serializeNode('list_item')).toEqual(['li', 0])
  })

  it('hard_break toDOM returns ["br"]', () => {
    expect(serializeNode('hard_break')).toEqual(['br'])
  })

  it('bold toDOM returns ["strong", 0]', () => {
    const mark = schema.marks.bold.create()
    expect(schema.marks.bold.spec.toDOM?.(mark, true)).toEqual(['strong', 0])
  })

  it('italic toDOM returns ["em", 0]', () => {
    const mark = schema.marks.italic.create()
    expect(schema.marks.italic.spec.toDOM?.(mark, true)).toEqual(['em', 0])
  })

  it('code toDOM returns ["code", 0]', () => {
    const mark = schema.marks.code.create()
    expect(schema.marks.code.spec.toDOM?.(mark, true)).toEqual(['code', 0])
  })

  it('link toDOM without title omits title attr', () => {
    const mark = schema.marks.link.create({ href: 'https://example.com', title: null })
    const dom = schema.marks.link.spec.toDOM?.(mark, true) as unknown as unknown[]
    const attrs = dom[1] as Record<string, string>
    expect(attrs.href).toBe('https://example.com')
    expect(attrs.title).toBeUndefined()
  })
})

describe('XSS filtering via parseDOM', () => {
  it('link with control characters in javascript: href is rejected', () => {
    const el = document.createElement('a')
    el.setAttribute('href', 'java\tscript:alert(1)')
    const rule = schema.marks.link.spec.parseDOM?.[0] as {
      getAttrs: (dom: HTMLElement) => unknown
    }
    expect(rule.getAttrs?.(el)).toBe(false)
  })

  it('link accepts safe https href', () => {
    const el = document.createElement('a')
    el.setAttribute('href', 'https://example.com')
    const rule = schema.marks.link.spec.parseDOM?.[0] as {
      getAttrs: (dom: HTMLElement) => unknown
    }
    const result = rule.getAttrs?.(el) as { href: string; title: string | null }
    expect(result).not.toBe(false)
    expect(result.href).toBe('https://example.com')
  })

  it('link accepts relative href', () => {
    const el = document.createElement('a')
    el.setAttribute('href', '/page')
    const rule = schema.marks.link.spec.parseDOM?.[0] as {
      getAttrs: (dom: HTMLElement) => unknown
    }
    const result = rule.getAttrs?.(el) as { href: string }
    expect(result).not.toBe(false)
    expect(result.href).toBe('/page')
  })

  it('script tags are not in schema', () => {
    expect(schema.nodes.script).toBeUndefined()
  })

  it('iframe tags are not in schema', () => {
    expect(schema.nodes.iframe).toBeUndefined()
  })
})
