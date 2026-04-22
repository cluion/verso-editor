import { describe, expect, it } from 'vitest'
import { PaginationExtension } from '../index'

describe('PaginationExtension', () => {
  it('has name pagination', () => {
    expect(PaginationExtension.name).toBe('pagination')
  })
  it('has default mode continuous', () => {
    expect(PaginationExtension.options.mode).toBe('continuous')
  })
  it('has default pageHeight', () => {
    expect(PaginationExtension.options.pageHeight).toBe(1123)
  })
  it('has plugins', () => {
    expect(PaginationExtension.plugins.length).toBeGreaterThan(0)
  })
})
