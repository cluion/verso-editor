import { Schema } from 'prosemirror-model'
import type { Extension, MarkExtension, NodeExtension } from './extension'

// Base nodes that are always included
const BASE_NODES: Record<string, NodeSpec> = {
  doc: { content: 'block+' },
  paragraph: {
    content: 'inline*',
    group: 'block',
    toDOM: () => ['p', 0] as unknown as HTMLElement,
  },
  text: { group: 'inline' },
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    toDOM: () => ['br'] as unknown as HTMLElement,
  },
}

type NodeSpec = { [key: string]: unknown }
type MarkSpec = { [key: string]: unknown }

type AnyExtension = Extension | NodeExtension | MarkExtension

function isNodeExtension(ext: AnyExtension): ext is NodeExtension {
  return 'nodeSpec' in ext && ext.nodeSpec !== undefined
}

function isMarkExtension(ext: AnyExtension): ext is MarkExtension {
  return 'markSpec' in ext && ext.markSpec !== undefined
}

export function resolveSchema(extensions: AnyExtension[]): Schema {
  const nodes: Record<string, NodeSpec> = { ...BASE_NODES }
  const marks: Record<string, MarkSpec> = {}

  for (const ext of extensions) {
    if (isNodeExtension(ext)) {
      nodes[ext.name] = ext.nodeSpec as NodeSpec
    }
    if (isMarkExtension(ext)) {
      marks[ext.name] = ext.markSpec as MarkSpec
    }
  }

  return new Schema({ nodes, marks })
}
