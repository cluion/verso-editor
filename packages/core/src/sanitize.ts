import DOMPurify from 'dompurify'

export interface SanitizeOptions {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
}

const DEFAULT_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'del',
  'sub',
  'sup',
  'mark',
  'code',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'hr',
  'a',
  'img',
  'span',
  'div',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]

const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
  pre: ['data-language'],
  ol: ['start'],
  span: ['style'],
  p: ['style'],
  li: ['data-type', 'data-checked'],
  ul: ['data-type'],
  input: ['type', 'checked'],
  mark: ['style'],
}

export function sanitizeHTML(html: string, options?: SanitizeOptions): string {
  if (!html) return ''

  const allowedTags = options?.allowedTags ?? DEFAULT_ALLOWED_TAGS
  const allowedAttributes = options?.allowedAttributes ?? DEFAULT_ALLOWED_ATTRIBUTES

  // Only allow input[type=checkbox] for task lists
  DOMPurify.addHook('uponSanitizeElement', (node) => {
    if (node.nodeName === 'INPUT') {
      const input = node as HTMLInputElement
      if (input.type !== 'checkbox') {
        input.remove()
      }
    }
  })

  const result = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...allowedTags, 'input'],
    ALLOWED_ATTR: [...new Set(Object.values(allowedAttributes).flat())],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'textarea', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'formaction'],
  })

  DOMPurify.removeAllHooks()
  return result
}
