import type { NodeViewFactory } from '@verso-editor/core'
import katex from 'katex'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

export function createMathNodeView(): NodeViewFactory {
  return (node: Node, view: EditorView, getPos: () => number | undefined) => {
    const container = document.createElement('span')
    container.classList.add('verso-math')
    if (node.attrs.inline) {
      container.classList.add('verso-math--inline')
    }

    const rendered = document.createElement('span')
    rendered.classList.add('verso-math-rendered')
    container.appendChild(rendered)

    const latex = node.attrs.latex ?? ''

    function renderLatex(text: string) {
      try {
        katex.render(text, rendered, {
          throwOnError: false,
          displayMode: !node.attrs.inline,
        })
      } catch {
        rendered.textContent = text
      }
    }

    renderLatex(latex)

    let editing = false
    let editor: HTMLTextAreaElement | null = null

    function startEditing() {
      if (editing) return
      editing = true
      container.classList.add('verso-math--editing')

      editor = document.createElement('textarea')
      editor.classList.add('verso-math-editor')
      editor.value = latex
      editor.addEventListener('blur', finishEditing)
      editor.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          finishEditing()
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          finishEditing()
        }
      })

      container.appendChild(editor)
      editor.focus()
      rendered.style.display = 'none'
    }

    function finishEditing() {
      if (!editing || !editor) return
      editing = false

      const newLatex = editor.value
      container.classList.remove('verso-math--editing')
      editor.removeEventListener('blur', finishEditing)
      editor.remove()
      editor = null
      rendered.style.display = ''

      const pos = getPos()
      if (pos !== undefined && newLatex !== latex) {
        const tr = view.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          latex: newLatex,
        })
        view.dispatch(tr)
      }
    }

    container.addEventListener('dblclick', () => {
      startEditing()
    })

    return {
      dom: container,
      update(updatedNode: Node) {
        if (updatedNode.type.name !== 'math') return false
        renderLatex(updatedNode.attrs.latex ?? '')
        return true
      },
      destroy() {
        if (editor) {
          editor.removeEventListener('blur', finishEditing)
        }
      },
      ignoreMutation() {
        return true
      },
      selectNode() {
        container.classList.add('verso-math--selected')
      },
      deselectNode() {
        container.classList.remove('verso-math--selected')
      },
    }
  }
}
