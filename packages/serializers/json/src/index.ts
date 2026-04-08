import { Node, type Schema } from 'prosemirror-model'
import type { Node as ProseMirrorNode } from 'prosemirror-model'

export interface JSONNode {
  type: string
  content?: JSONNode[]
  text?: string
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
  attrs?: Record<string, unknown>
}

export function toJSON(doc: ProseMirrorNode): JSONNode {
  return doc.toJSON() as JSONNode
}

export function fromJSON(schema: Schema, json: JSONNode): ProseMirrorNode {
  return Node.fromJSON(schema, json)
}
