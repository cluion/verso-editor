import { describe, expect, it } from 'vitest'
import { sanitizeHTML } from '../sanitize'

describe('sanitizeHTML', () => {
  it('strips script tags', () => {
    const result = sanitizeHTML('<p>Hello</p><script>alert("xss")</script>')
    expect(result).toBe('<p>Hello</p>')
  })

  it('strips iframe tags', () => {
    const result = sanitizeHTML('<p>Hello</p><iframe src="evil.com"></iframe>')
    expect(result).toBe('<p>Hello</p>')
  })

  it('strips event handler attributes', () => {
    const result = sanitizeHTML('<p onclick="alert(1)">Hello</p>')
    expect(result).toBe('<p>Hello</p>')
  })

  it('strips onerror attribute on img', () => {
    const result = sanitizeHTML('<img src="x" onerror="alert(1)">')
    expect(result).toBe('<img src="x">')
  })

  it('strips onmouseover attribute', () => {
    const result = sanitizeHTML('<div onmouseover="alert(1)">text</div>')
    expect(result).toBe('<div>text</div>')
  })

  it('strips javascript: protocol in href', () => {
    const result = sanitizeHTML('<a href="javascript:alert(1)">link</a>')
    expect(result).not.toContain('javascript:')
  })

  it('strips data: protocol in href', () => {
    const result = sanitizeHTML('<a href="data:text/html,<script>alert(1)</script>">link</a>')
    expect(result).not.toContain('data:')
  })

  it('preserves safe HTML', () => {
    const html = '<p>Hello <strong>world</strong></p>'
    const result = sanitizeHTML(html)
    expect(result).toBe(html)
  })

  it('preserves heading tags', () => {
    const html = '<h1>Title</h1><h2>Subtitle</h2>'
    const result = sanitizeHTML(html)
    expect(result).toBe(html)
  })

  it('preserves list tags', () => {
    const html = '<ul><li>item</li></ul>'
    const result = sanitizeHTML(html)
    expect(result).toBe(html)
  })

  it('preserves table tags', () => {
    const result = sanitizeHTML('<table><tr><td>cell</td></tr></table>')
    expect(result).toContain('<table>')
    expect(result).toContain('<tr>')
    expect(result).toContain('<td>cell</td>')
  })

  it('preserves link with href', () => {
    const result = sanitizeHTML('<a href="https://example.com">link</a>')
    expect(result).toContain('href="https://example.com"')
  })

  it('preserves img with src and alt', () => {
    const result = sanitizeHTML('<img src="photo.jpg" alt="photo">')
    expect(result).toContain('src="photo.jpg"')
    expect(result).toContain('alt="photo"')
  })

  it('returns empty string for empty input', () => {
    expect(sanitizeHTML('')).toBe('')
  })

  it('strips style tags', () => {
    const result = sanitizeHTML('<style>body{display:none}</style><p>Hello</p>')
    expect(result).toBe('<p>Hello</p>')
  })

  it('strips form elements', () => {
    const result = sanitizeHTML('<form><input type="text"><button>submit</button></form>')
    expect(result).not.toContain('<form')
    expect(result).not.toContain('<input')
    expect(result).not.toContain('<button')
  })

  it('accepts custom allowed tags', () => {
    const result = sanitizeHTML('<p>Hello</p><custom>world</custom>', {
      allowedTags: ['p', 'custom'],
    })
    expect(result).toContain('<p>Hello</p>')
    expect(result).toContain('<custom>world</custom>')
  })

  it('strips data-* attributes by default', () => {
    const result = sanitizeHTML('<p data-custom="value">text</p>')
    expect(result).not.toContain('data-custom')
  })
})
