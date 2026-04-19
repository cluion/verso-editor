import { describe, expect, it } from 'vitest'
import { DetailsContentExtension, DetailsExtension, DetailsSummaryExtension } from '../index'

describe('DetailsExtension', () => {
  it('has name details', () => {
    expect(DetailsExtension.name).toBe('details')
  })

  it('has nodeSpec with block group', () => {
    expect(DetailsExtension.nodeSpec.group).toBe('block')
  })

  it('has open attr', () => {
    const attrs = DetailsExtension.nodeSpec.attrs as Record<string, unknown>
    expect(attrs).toHaveProperty('open')
  })
})

describe('DetailsSummaryExtension', () => {
  it('has name details_summary', () => {
    expect(DetailsSummaryExtension.name).toBe('details_summary')
  })
})

describe('DetailsContentExtension', () => {
  it('has name details_content', () => {
    expect(DetailsContentExtension.name).toBe('details_content')
  })
})
