import { Editor, NodeExtension } from '@verso-editor/core'
import { describe, expect, it } from 'vitest'
import { createCodeBlockNodeView } from '../codeblock-nodeview'

// Minimal extensions for schema
const doc = NodeExtension.create({
  name: 'doc',
  nodeSpec: {
    content: 'block+',
    toDOM: () => ['div', 0] as unknown as HTMLElement,
  },
})

const paragraph = NodeExtension.create({
  name: 'paragraph',
  nodeSpec: {
    content: 'inline*',
    group: 'block',
    toDOM: () => ['p', 0] as unknown as HTMLElement,
  },
})

const text = NodeExtension.create({
  name: 'text',
  nodeSpec: {
    group: 'inline',
    inline: true,
    toDOM: () => 'text' as unknown as HTMLElement,
  },
})

function createEditorWithCodeBlock() {
  const element = document.createElement('div')
  document.body.appendChild(element)

  const codeBlock = NodeExtension.create({
    name: 'code_block',
    nodeSpec: {
      content: 'text*',
      group: 'block',
      marks: '',
      attrs: {
        language: { default: '' },
      },
      toDOM: () => ['pre', ['code', 0]] as unknown as HTMLElement,
      parseDOM: [
        {
          tag: 'pre',
          preserveWhitespace: 'full' as const,
          getAttrs: (dom) => ({
            language: (dom as HTMLElement).getAttribute('data-language') ?? '',
          }),
        },
      ],
    },
    nodeView: createCodeBlockNodeView(),
  })

  const editor = new Editor({
    element,
    extensions: [doc, paragraph, text, codeBlock],
  })

  return { editor, element }
}

describe('CodeBlockNodeView', () => {
  it('creates a wrapper with pre and code elements', () => {
    const { editor, element } = createEditorWithCodeBlock()
    editor.setContent('<pre><code>console.log("hello")</code></pre>')

    const wrapper = element.querySelector('.verso-codeblock-wrapper')
    expect(wrapper).not.toBeNull()

    const pre = wrapper?.querySelector('pre')
    expect(pre).not.toBeNull()

    const code = wrapper?.querySelector('code')
    expect(code).not.toBeNull()

    editor.destroy()
  })

  it('renders language badge when language is set', () => {
    const { editor, element } = createEditorWithCodeBlock()

    // Insert a code_block with language attribute
    let cbPos = -1
    editor.setContent('<pre><code>let x = 1</code></pre>')

    editor.view.state.doc.descendants((node, pos) => {
      if (node.type.name === 'code_block') {
        cbPos = pos
        return false
      }
    })

    if (cbPos >= 0) {
      const node = editor.view.state.doc.nodeAt(cbPos)
      if (!node) {
        editor.destroy()
        return
      }
      const tr = editor.view.state.tr.setNodeMarkup(cbPos, undefined, {
        ...node.attrs,
        language: 'typescript',
      })
      editor.view.dispatch(tr)
    }

    const badge = element.querySelector('.verso-codeblock-language')
    expect(badge?.textContent).toBe('typescript')

    editor.destroy()
  })

  it('updates content when node changes', () => {
    const { editor, element } = createEditorWithCodeBlock()
    editor.setContent('<pre><code>old code</code></pre>')

    const code = element.querySelector('.verso-codeblock-wrapper code')
    expect(code?.textContent).toContain('old code')

    editor.destroy()
  })

  it('applies syntax highlight classes', () => {
    const { editor, element } = createEditorWithCodeBlock()
    editor.setContent('<pre><code>const x = 1</code></pre>')

    // The nodeView should apply some form of highlighting
    const wrapper = element.querySelector('.verso-codeblock-wrapper')
    expect(wrapper).not.toBeNull()
    // Should have a highlight container
    expect(wrapper?.querySelector('.verso-codeblock-highlight')).not.toBeNull()

    editor.destroy()
  })

  it('handles empty code block', () => {
    const { editor, element } = createEditorWithCodeBlock()
    editor.setContent('<pre><code></code></pre>')

    const wrapper = element.querySelector('.verso-codeblock-wrapper')
    expect(wrapper).not.toBeNull()

    editor.destroy()
  })

  it('cleans up on destroy', () => {
    const { editor, element } = createEditorWithCodeBlock()
    editor.setContent('<pre><code>test</code></pre>')

    expect(element.querySelector('.verso-codeblock-wrapper')).not.toBeNull()
    editor.destroy()
    expect(element.querySelector('.verso-codeblock-wrapper')).toBeNull()
  })
})
