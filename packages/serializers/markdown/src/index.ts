import { defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown'
import type { Node as ProseMirrorNode, Schema } from 'prosemirror-model'

export function toMarkdown(doc: ProseMirrorNode): string {
  return defaultMarkdownSerializer.serialize(doc)
}

export function fromMarkdown(md: string, _schema: Schema): ProseMirrorNode {
  return defaultMarkdownParser.parse(md)
}
