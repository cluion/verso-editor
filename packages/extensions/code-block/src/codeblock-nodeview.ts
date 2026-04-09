import type { NodeViewFactory } from '@verso-editor/core'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

interface Token {
  type: string
  value: string
}

const KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'class',
  'import',
  'export',
  'from',
  'default',
  'async',
  'await',
  'new',
  'this',
  'typeof',
  'instanceof',
  'try',
  'catch',
  'throw',
  'switch',
  'case',
  'break',
  'continue',
  'true',
  'false',
  'null',
  'undefined',
  'void',
  'interface',
  'type',
  'enum',
  'extends',
  'implements',
  'def',
  'self',
  'print',
  'lambda',
  'with',
  'as',
  'in',
  'not',
  'and',
  'or',
])

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []

  // Check for line comment first
  const commentIdx = line.indexOf('//')
  if (commentIdx >= 0) {
    if (commentIdx > 0) {
      tokens.push(...tokenizeLine(line.slice(0, commentIdx)))
    }
    tokens.push({ type: 'comment', value: line.slice(commentIdx) })
    return tokens
  }

  const regex =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:\d+\.?\d*)\b|\b\w+\b|\S)/g
  let lastIndex = 0

  let execResult = regex.exec(line)
  while (execResult !== null) {
    if (execResult.index > lastIndex) {
      tokens.push({ type: 'plain', value: line.slice(lastIndex, execResult.index) })
    }

    const value = execResult[0]

    if (KEYWORDS.has(value)) {
      tokens.push({ type: 'keyword', value })
    } else if (/^["'`]/.test(value)) {
      tokens.push({ type: 'string', value })
    } else if (/^\d/.test(value)) {
      tokens.push({ type: 'number', value })
    } else {
      tokens.push({ type: 'plain', value })
    }

    lastIndex = execResult.index + value.length
    execResult = regex.exec(line)
  }

  if (lastIndex < line.length) {
    tokens.push({ type: 'plain', value: line.slice(lastIndex) })
  }

  return tokens
}

function highlightCode(text: string, _language: string): DocumentFragment {
  const fragment = document.createDocumentFragment()
  const lines = text.split('\n')

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    if (lineIdx > 0) {
      fragment.appendChild(document.createTextNode('\n'))
    }

    const tokens = tokenizeLine(lines[lineIdx] ?? '')
    for (const token of tokens) {
      if (token.type === 'plain') {
        fragment.appendChild(document.createTextNode(token.value))
      } else {
        const span = document.createElement('span')
        span.classList.add(`verso-token-${token.type}`)
        span.textContent = token.value
        fragment.appendChild(span)
      }
    }
  }

  return fragment
}

/**
 * Create a CodeBlock NodeView with syntax highlighting and language badge.
 */
export function createCodeBlockNodeView(): NodeViewFactory {
  return (node: Node, _view: EditorView, _getPos: () => number | undefined) => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('verso-codeblock-wrapper')

    const badge = document.createElement('div')
    badge.classList.add('verso-codeblock-language')
    const lang = node.attrs.language ?? ''
    badge.textContent = lang
    if (lang) {
      wrapper.appendChild(badge)
    }

    const highlightContainer = document.createElement('div')
    highlightContainer.classList.add('verso-codeblock-highlight')

    const pre = document.createElement('pre')
    const code = document.createElement('code')
    code.appendChild(highlightCode(node.textContent, lang))

    pre.appendChild(code)
    highlightContainer.appendChild(pre)
    wrapper.appendChild(highlightContainer)

    return {
      dom: wrapper,

      update(updatedNode: Node) {
        if (updatedNode.type.name !== 'code_block') return false

        const newLang = updatedNode.attrs.language ?? ''
        if (badge.textContent !== newLang) {
          badge.textContent = newLang
          if (newLang && !wrapper.contains(badge)) {
            wrapper.insertBefore(badge, highlightContainer)
          } else if (!newLang && wrapper.contains(badge)) {
            wrapper.removeChild(badge)
          }
        }

        code.textContent = ''
        code.appendChild(highlightCode(updatedNode.textContent, newLang))

        return true
      },

      destroy() {
        wrapper.remove()
      },

      ignoreMutation() {
        return true
      },
    }
  }
}
