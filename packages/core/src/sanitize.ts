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
}

export function sanitizeHTML(html: string, options?: SanitizeOptions): string {
  if (!html) return ''

  const allowedTags = options?.allowedTags ?? DEFAULT_ALLOWED_TAGS
  const allowedAttributes = options?.allowedAttributes ?? DEFAULT_ALLOWED_ATTRIBUTES

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: Object.values(allowedAttributes).flat(),
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input', 'textarea', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'formaction'],
  })
}
