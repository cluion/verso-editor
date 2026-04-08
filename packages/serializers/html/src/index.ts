import {
  DOMParser,
  DOMSerializer,
  type Node as ProseMirrorNode,
  type Schema,
} from 'prosemirror-model'

export function toHTML(doc: ProseMirrorNode, schema: Schema): string {
  const fragment = DOMSerializer.fromSchema(schema).serializeFragment(doc.content)
  const div = document.createElement('div')
  div.appendChild(fragment)
  return div.innerHTML
}

export function fromHTML(html: string, schema: Schema): ProseMirrorNode {
  // html is developer-provided content parsed through ProseMirror schema validation
  const div = document.createElement('div')
  div.innerHTML = html
  return DOMParser.fromSchema(schema).parse(div)
}
