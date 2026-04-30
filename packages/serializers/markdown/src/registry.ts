import MarkdownIt from 'markdown-it'
import {
  MarkdownParser,
  MarkdownSerializer,
  type MarkdownSerializerState,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from 'prosemirror-markdown'
import type { Mark, Node as PMNode, Schema } from 'prosemirror-model'

export type NodeSerializerFn = (
  state: MarkdownSerializerState,
  node: PMNode,
  parent: PMNode,
  index: number,
) => void

export interface MarkSerializerEntry {
  open:
    | string
    | ((state: MarkdownSerializerState, mark: Mark, parent: PMNode, index: number) => string)
  close:
    | string
    | ((state: MarkdownSerializerState, mark: Mark, parent: PMNode, index: number) => string)
  mixable?: boolean
  expelEnclosingWhitespace?: boolean
  escape?: boolean
}

export interface ParserTokenEntry {
  node?: string
  block?: string
  mark?: string
  attrs?: Record<string, unknown> | null
  getAttrs?: (
    token: unknown,
    tokenStream: unknown[],
    index: number,
  ) => Record<string, unknown> | null
  noCloseToken?: boolean
  ignore?: boolean
}

export type TokenizerPlugin = (md: MarkdownIt) => void

export interface SerializerEntries {
  nodes?: Record<string, NodeSerializerFn>
  marks?: Record<string, MarkSerializerEntry>
  parserTokens?: Record<string, ParserTokenEntry>
  tokenizerPlugins?: TokenizerPlugin[]
}

export class SerializerRegistry {
  private readonly nodes = new Map<string, NodeSerializerFn>()
  private readonly marks = new Map<string, MarkSerializerEntry>()
  private readonly tokens = new Map<string, ParserTokenEntry>()
  private readonly plugins: TokenizerPlugin[] = []

  addNodeSerializer(name: string, fn: NodeSerializerFn): this {
    this.nodes.set(name, fn)
    return this
  }

  addMarkSerializer(name: string, spec: MarkSerializerEntry): this {
    this.marks.set(name, spec)
    return this
  }

  addParserToken(name: string, spec: ParserTokenEntry): this {
    this.tokens.set(name, spec)
    return this
  }

  addTokenizerPlugin(plugin: TokenizerPlugin): this {
    this.plugins.push(plugin)
    return this
  }

  addEntries(entries: SerializerEntries): this {
    if (entries.nodes) {
      for (const [name, fn] of Object.entries(entries.nodes)) {
        this.nodes.set(name, fn)
      }
    }
    if (entries.marks) {
      for (const [name, spec] of Object.entries(entries.marks)) {
        this.marks.set(name, spec)
      }
    }
    if (entries.parserTokens) {
      for (const [name, spec] of Object.entries(entries.parserTokens)) {
        this.tokens.set(name, spec)
      }
    }
    if (entries.tokenizerPlugins) {
      this.plugins.push(...entries.tokenizerPlugins)
    }
    return this
  }

  merge(other: SerializerRegistry): this {
    for (const [name, fn] of other.nodes) {
      this.nodes.set(name, fn)
    }
    for (const [name, spec] of other.marks) {
      this.marks.set(name, spec)
    }
    for (const [name, spec] of other.tokens) {
      this.tokens.set(name, spec)
    }
    this.plugins.push(...other.plugins)
    return this
  }

  buildSerializer(): MarkdownSerializer {
    const nodes: Record<string, NodeSerializerFn> = {
      ...defaultMarkdownSerializer.nodes,
    }
    const marks: Record<string, MarkSerializerEntry> = {
      ...defaultMarkdownSerializer.marks,
    }

    for (const [name, fn] of this.nodes) {
      nodes[name] = fn
    }
    for (const [name, spec] of this.marks) {
      marks[name] = spec
    }

    return new MarkdownSerializer(nodes, marks, { strict: false })
  }

  buildParser(schema: Schema): MarkdownParser {
    const tokenizer = new MarkdownIt('default', {
      html: true,
      linkify: true,
    })

    tokenizer.enable(['table', 'strikethrough'])

    for (const plugin of this.plugins) {
      plugin(tokenizer)
    }

    const allTokens: Record<string, ParserTokenEntry> = {
      ...defaultMarkdownParser.tokens,
    }
    for (const [name, spec] of this.tokens) {
      allTokens[name] = spec
    }

    // Filter out tokens referencing node/mark types absent from this schema
    const tokens: Record<string, ParserTokenEntry> = {}
    for (const [name, spec] of Object.entries(allTokens)) {
      const s = spec as Record<string, unknown>
      if (s.node && !schema.nodes[s.node as string]) continue
      if (s.block && !schema.nodes[s.block as string]) continue
      if (s.mark && !schema.marks[s.mark as string]) continue
      tokens[name] = spec
    }

    return new MarkdownParser(schema, tokenizer, tokens)
  }
}
