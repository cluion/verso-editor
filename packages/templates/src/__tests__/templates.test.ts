import { describe, expect, it } from 'vitest'
import { getCategories, getTemplateById, getTemplates } from '../index'

describe('@verso-editor/templates', () => {
  it('returns all templates without filter', () => {
    const all = getTemplates()
    expect(all.length).toBe(6)
    expect(all.map((t) => t.id)).toEqual([
      'blank',
      'report',
      'letter',
      'meeting-notes',
      'blog-post',
      'readme',
    ])
  })

  it('filters by category', () => {
    const business = getTemplates('business')
    expect(business.length).toBe(3)
    expect(business.every((t) => t.category === 'business')).toBe(true)
  })

  it('returns empty array for unknown category', () => {
    expect(getTemplates('nonexistent')).toEqual([])
  })

  it('finds template by id', () => {
    const tpl = getTemplateById('report')
    expect(tpl?.name).toBe('Report')
    expect(tpl?.category).toBe('business')
    expect(tpl?.html).toContain('<h1>')
  })

  it('returns undefined for unknown id', () => {
    expect(getTemplateById('nonexistent')).toBeUndefined()
  })

  it('returns unique categories', () => {
    const cats = getCategories()
    expect(cats).toEqual(['general', 'business', 'content', 'technical'])
  })

  it('each template has required fields', () => {
    for (const tpl of getTemplates()) {
      expect(tpl.id).toBeTruthy()
      expect(tpl.name).toBeTruthy()
      expect(tpl.category).toBeTruthy()
      expect(tpl.html).toBeTruthy()
    }
  })
})
