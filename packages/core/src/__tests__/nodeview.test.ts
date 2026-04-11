import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { Editor } from '../editor'
import { NodeExtension } from '../extension'

// Custom NodeView that wraps content in a div with a class
function customNodeViewFactory() {
  return (_node: ProseMirrorNode, _view: unknown, _getPos: () => number | undefined) => {
    const dom = document.createElement('div')
    dom.classList.add('custom-node')
    const contentDOM = document.createElement('span')
    contentDOM.classList.add('custom-content')
    dom.appendChild(contentDOM)
    return { dom, contentDOM }
  }
}

describe('NodeView System', () => {
  it('registers nodeView from extension', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const custom = NodeExtension.create({
      name: 'custom',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () =>
          [
            'div',
            { class: 'custom-node' },
            ['span', { class: 'custom-content' }, 0],
          ] as unknown as HTMLElement,
      },
      nodeView: customNodeViewFactory(),
    })

    const editor = new Editor({ element, extensions: [custom] })
    editor.setContent('<p>Test</p>')
    // Editor should be created successfully with nodeView registered
    expect(editor.view.dom.parentElement).toBe(element)
    editor.destroy()
  })

  it('collects nodeViews from multiple extensions', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const ext1 = NodeExtension.create({
      name: 'custom_a',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['div', 0] as unknown as HTMLElement,
      },
      nodeView: customNodeViewFactory(),
    })

    const ext2 = NodeExtension.create({
      name: 'custom_b',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['div', 0] as unknown as HTMLElement,
      },
      nodeView: customNodeViewFactory(),
    })

    const editor = new Editor({ element, extensions: [ext1, ext2] })
    expect(editor.schema.nodes.custom_a).toBeDefined()
    expect(editor.schema.nodes.custom_b).toBeDefined()
    editor.destroy()
  })

  it('works without nodeView (uses default toDOM)', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const plain = NodeExtension.create({
      name: 'plain_node',
      nodeSpec: {
        content: 'inline*',
        group: 'block',
        toDOM: () => ['div', 0] as unknown as HTMLElement,
      },
    })

    const editor = new Editor({ element, extensions: [plain] })
    editor.setContent('<div>Hello</div>')
    expect(editor.getHTML()).toContain('Hello')
    editor.destroy()
  })
})
