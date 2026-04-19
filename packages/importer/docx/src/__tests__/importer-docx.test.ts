import { describe, expect, it } from 'vitest'
import type { ImportDocxResult } from '../index'

describe('@verso-editor/importer-docx', () => {
  it('ImportDocxResult type has correct shape', () => {
    const result: ImportDocxResult = {
      html: '<p>Hello</p>',
      messages: [],
    }
    expect(result.html).toBe('<p>Hello</p>')
    expect(result.messages).toEqual([])
  })

  it('importDocx function is importable', async () => {
    const { importDocx } = await import('../index')
    expect(typeof importDocx).toBe('function')
  })
})
