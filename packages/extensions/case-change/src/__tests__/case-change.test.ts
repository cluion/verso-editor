import { describe, expect, it } from 'vitest'
import { CaseChangeExtension, toLowerCase, toTitleCase, toUpperCase } from '../index'

describe('CaseChangeExtension', () => {
  it('has name caseChange', () => {
    expect(CaseChangeExtension.name).toBe('caseChange')
  })
})

describe('Case change commands', () => {
  it('exports toUpperCase', () => {
    expect(toUpperCase).toBeDefined()
  })
  it('exports toLowerCase', () => {
    expect(toLowerCase).toBeDefined()
  })
  it('exports toTitleCase', () => {
    expect(toTitleCase).toBeDefined()
  })
})
