import type { NodeViewFactory } from '@verso-editor/core'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

type MermaidAPI = {
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, code: string) => Promise<{ svg: string }>
}

let mermaidModule: MermaidAPI | null = null
let mermaidInitialized = false
let renderCounter = 0

async function loadMermaid(config?: Record<string, unknown>): Promise<MermaidAPI> {
  if (!mermaidModule) {
    mermaidModule = (await import('mermaid')).default as unknown as MermaidAPI
  }
  if (!mermaidInitialized) {
    mermaidModule.initialize({
      startOnLoad: false,
      theme: 'default',
      ...config,
    })
    mermaidInitialized = true
  }
  return mermaidModule
}

function setSafeSVG(container: HTMLElement, svgString: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  const svgEl = doc.querySelector('svg')
  if (svgEl) {
    container.replaceChildren(svgEl)
  }
}

export function createMermaidNodeView(): NodeViewFactory {
  return (node: Node, view: EditorView, getPos: () => number | undefined) => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('verso-mermaid-wrapper')

    const previewContainer = document.createElement('div')
    previewContainer.classList.add('verso-mermaid-preview')

    const sourceContainer = document.createElement('div')
    sourceContainer.classList.add('verso-mermaid-source')
    sourceContainer.style.display = 'none'

    const textarea = document.createElement('textarea')
    textarea.classList.add('verso-mermaid-textarea')
    textarea.value = node.textContent
    sourceContainer.appendChild(textarea)

    const spinner = document.createElement('div')
    spinner.classList.add('verso-mermaid-spinner')
    spinner.textContent = 'Loading...'
    previewContainer.appendChild(spinner)

    wrapper.appendChild(previewContainer)
    wrapper.appendChild(sourceContainer)

    let showingPreview = true

    function toggleView() {
      showingPreview = !showingPreview
      previewContainer.style.display = showingPreview ? '' : 'none'
      sourceContainer.style.display = showingPreview ? 'none' : ''

      if (showingPreview) {
        const code = textarea.value
        const pos = getPos()
        if (pos !== undefined) {
          const textNode = view.state.schema.text(code)
          const newTr = view.state.tr.replaceWith(pos + 1, pos + node.nodeSize - 1, textNode)
          view.dispatch(newTr)
        }
        render(code)
      }
    }

    wrapper.addEventListener('click', (e) => {
      if (e.target === textarea) return
      toggleView()
    })

    async function render(code: string) {
      if (!code.trim()) {
        const empty = document.createElement('div')
        empty.classList.add('verso-mermaid-empty')
        empty.textContent = 'No diagram source'
        previewContainer.replaceChildren(empty)
        return
      }

      const loadingEl = document.createElement('div')
      loadingEl.classList.add('verso-mermaid-spinner')
      loadingEl.textContent = 'Rendering...'
      previewContainer.replaceChildren(loadingEl)

      try {
        const mermaid = await loadMermaid(
          (MermaidExtension as unknown as { options: { mermaidConfig?: Record<string, unknown> } })
            .options?.mermaidConfig,
        )
        const id = `mermaid-${++renderCounter}-${Date.now()}`
        const { svg } = await mermaid.render(id, code)
        setSafeSVG(previewContainer, svg)
      } catch (err) {
        const errorDiv = document.createElement('div')
        errorDiv.classList.add('verso-mermaid-error')
        errorDiv.textContent = err instanceof Error ? err.message : 'Invalid mermaid syntax'
        previewContainer.replaceChildren(errorDiv)
      }
    }

    render(node.textContent)

    return {
      dom: wrapper,

      update(updatedNode: Node) {
        if (updatedNode.type.name !== 'mermaid') return false

        const newCode = updatedNode.textContent
        if (textarea.value !== newCode) {
          textarea.value = newCode
        }

        if (showingPreview) {
          render(newCode)
        }

        return true
      },

      destroy() {
        wrapper.remove()
        previewContainer.replaceChildren()
      },

      ignoreMutation() {
        return true
      },
    }
  }
}
