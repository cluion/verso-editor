import { defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown'
import type { Node as ProseMirrorNode, Schema } from 'prosemirror-model'
import { gfmEntries } from './gfm'
import { type SerializerEntries, SerializerRegistry } from './registry'

export { SerializerRegistry } from './registry'
export type {
  SerializerEntries,
  NodeSerializerFn,
  MarkSerializerEntry,
  ParserTokenEntry,
  TokenizerPlugin,
} from './registry'
export { gfmEntries } from './gfm'

function buildRegistry(entries?: SerializerEntries[]): SerializerRegistry {
  const registry = new SerializerRegistry()
  registry.addEntries(gfmEntries)
  if (entries) {
    for (const entry of entries) {
      registry.addEntries(entry)
    }
  }
  return registry
}

export function toMarkdown(doc: ProseMirrorNode, entries?: SerializerEntries[]): string {
  const registry = buildRegistry(entries)
  const serializer = registry.buildSerializer()
  return serializer.serialize(doc)
}

export function fromMarkdown(
  md: string,
  schema: Schema,
  entries?: SerializerEntries[],
): ProseMirrorNode {
  const registry = buildRegistry(entries)
  const parser = registry.buildParser(schema)
  return parser.parse(md)
}

export { defaultMarkdownParser, defaultMarkdownSerializer }
