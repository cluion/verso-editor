import { Editor, NodeExtension } from '@verso-editor/core'
import { NodeSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { createImageNodeView } from '../image-nodeview'

// Minimal extensions needed for schema
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

function createEditorWithImage() {
  const element = document.createElement('div')
  document.body.appendChild(element)

  const image = NodeExtension.create({
    name: 'image',
    nodeSpec: {
      inline: true,
      group: 'inline',
      attrs: {
        src: { default: '' },
        alt: { default: '' },
        title: { default: '' },
        width: { default: null },
        height: { default: null },
      },
      draggable: true,
      toDOM: (node) => ['img', node.attrs] as unknown as HTMLElement,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: (dom) => ({
            src: (dom as HTMLElement).getAttribute('src') ?? '',
            alt: (dom as HTMLElement).getAttribute('alt') ?? '',
            title: (dom as HTMLElement).getAttribute('title') ?? '',
            width: (dom as HTMLElement).getAttribute('width'),
            height: (dom as HTMLElement).getAttribute('height'),
          }),
        },
      ],
    },
    nodeView: createImageNodeView(),
  })

  const editor = new Editor({
    element,
    extensions: [doc, paragraph, text, image],
  })

  return { editor, element }
}

describe('ImageNodeView', () => {
  it('creates a wrapper element with image inside', () => {
    const { editor, element } = createEditorWithImage()
    editor.setContent('<p><img src="test.png" alt="test"></p>')

    const wrapper = element.querySelector('.verso-image-wrapper')
    expect(wrapper).not.toBeNull()

    const img = wrapper?.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe('test.png')

    editor.destroy()
  })

  it('renders resize handles', () => {
    const { editor, element } = createEditorWithImage()
    editor.setContent('<p><img src="test.png"></p>')

    const handles = element.querySelectorAll('.verso-resize-handle')
    expect(handles.length).toBeGreaterThanOrEqual(1)

    editor.destroy()
  })

  it('shows selected state on NodeSelection', () => {
    const { editor, element } = createEditorWithImage()
    editor.setContent('<p><img src="test.png"></p>')

    // Find the image position and create a NodeSelection
    let imgPos = -1
    editor.view.state.doc.descendants((node, pos) => {
      if (node.type.name === 'image') {
        imgPos = pos
        return false
      }
    })

    expect(imgPos).toBeGreaterThanOrEqual(0)

    const nodeSelection = NodeSelection.create(editor.view.state.doc, imgPos)
    const tr = editor.view.state.tr.setSelection(nodeSelection)
    editor.view.dispatch(tr)

    const wrapper = element.querySelector('.verso-image-wrapper')
    expect(wrapper?.classList.contains('verso-image--selected')).toBe(true)

    editor.destroy()
  })

  it('updates image src when node changes', () => {
    const { editor, element } = createEditorWithImage()
    editor.setContent('<p><img src="old.png"></p>')

    let imgPos = -1
    editor.view.state.doc.descendants((node, pos) => {
      if (node.type.name === 'image') {
        imgPos = pos
        return false
      }
    })

    expect(imgPos).toBeGreaterThanOrEqual(0)

    const node = editor.view.state.doc.nodeAt(imgPos)
    if (!node) {
      editor.destroy()
      return
    }
    const tr = editor.view.state.tr.setNodeMarkup(imgPos, undefined, {
      ...node.attrs,
      src: 'new.png',
    })
    editor.view.dispatch(tr)

    const img = element.querySelector('.verso-image-wrapper img')
    expect(img?.getAttribute('src')).toBe('new.png')

    editor.destroy()
  })

  it('stores width/height attrs from node', () => {
    const { editor, element } = createEditorWithImage()
    editor.setContent('<p><img src="test.png" width="200" height="150"></p>')

    const img = element.querySelector('.verso-image-wrapper img')
    expect(img?.getAttribute('width')).toBe('200')
    expect(img?.getAttribute('height')).toBe('150')

    editor.destroy()
  })

  it('cleans up on destroy', () => {
    const { editor, element } = createEditorWithImage()
    editor.setContent('<p><img src="test.png"></p>')

    expect(element.querySelector('.verso-image-wrapper')).not.toBeNull()
    editor.destroy()
    expect(element.querySelector('.verso-image-wrapper')).toBeNull()
  })
})
