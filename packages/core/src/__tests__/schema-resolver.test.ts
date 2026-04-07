import { describe, expect, it } from 'vitest'
import { MarkExtension, NodeExtension } from '../extension'
import { resolveSchema } from '../schema-resolver'

describe('resolveSchema', () => {
  it('includes base nodes with no extensions', () => {
    const schema = resolveSchema([])
    expect(schema.nodes.doc).toBeDefined()
    expect(schema.nodes.paragraph).toBeDefined()
    expect(schema.nodes.text).toBeDefined()
    expect(schema.nodes.hard_break).toBeDefined()
  })

  it('merges NodeExtension nodeSpec into schema', () => {
    const heading = NodeExtension.create({
      name: 'heading',
      nodeSpec: {
        content: 'inline*',
        attrs: { level: { default: 1 } },
        toDOM: (node) => [`h${node.attrs.level}`, 0] as unknown as HTMLElement,
      },
    })
    const schema = resolveSchema([heading])
    expect(schema.nodes.heading).toBeDefined()
    // Base nodes still present
    expect(schema.nodes.paragraph).toBeDefined()
  })

  it('merges MarkExtension markSpec into schema', () => {
    const bold = MarkExtension.create({
      name: 'bold',
      markSpec: {
        parseDOM: [{ tag: 'strong' }],
        toDOM: () => ['strong', 0] as const,
      },
    })
    const schema = resolveSchema([bold])
    expect(schema.nodes.paragraph).toBeDefined()
    expect(schema.marks.bold).toBeDefined()
  })

  it('merges multiple extensions simultaneously', () => {
    const heading = NodeExtension.create({
      name: 'heading',
      nodeSpec: {
        content: 'inline*',
        attrs: { level: { default: 1 } },
        toDOM: () => ['h1', 0] as unknown as HTMLElement,
      },
    })
    const blockquote = NodeExtension.create({
      name: 'blockquote',
      nodeSpec: {
        content: 'block+',
        toDOM: () => ['blockquote', 0] as unknown as HTMLElement,
      },
    })
    const bold = MarkExtension.create({
      name: 'bold',
      markSpec: {
        parseDOM: [{ tag: 'strong' }],
        toDOM: () => ['strong', 0] as const,
      },
    })
    const italic = MarkExtension.create({
      name: 'italic',
      markSpec: {
        parseDOM: [{ tag: 'em' }],
        toDOM: () => ['em', 0] as const,
      },
    })
    const schema = resolveSchema([heading, blockquote, bold, italic])
    expect(schema.nodes.heading).toBeDefined()
    expect(schema.nodes.blockquote).toBeDefined()
    expect(schema.marks.bold).toBeDefined()
    expect(schema.marks.italic).toBeDefined()
    // Base nodes still present
    expect(schema.nodes.doc).toBeDefined()
    expect(schema.nodes.text).toBeDefined()
  })

  it('creates a valid ProseMirror Schema', () => {
    const schema = resolveSchema([])
    expect(schema.spec).toBeDefined()
    expect(schema.nodes).toBeDefined()
  })
})
