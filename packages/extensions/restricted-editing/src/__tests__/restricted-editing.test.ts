import { describe, expect, it } from 'vitest'
import { EditableMark, RestrictedEditingExtension } from '../index'

describe('EditableMark', () => {
  it('has name editable', () => {
    expect(EditableMark.name).toBe('editable')
  })
  it('has markSpec', () => {
    expect(EditableMark.markSpec).toBeDefined()
  })
})

describe('RestrictedEditingExtension', () => {
  it('has name restrictedEditing', () => {
    expect(RestrictedEditingExtension.name).toBe('restrictedEditing')
  })
  it('has plugins', () => {
    expect(RestrictedEditingExtension.plugins.length).toBeGreaterThan(0)
  })
})
