import { describe, expect, it } from 'vitest'
import { HistoryExtension } from '../index'

describe('HistoryExtension', () => {
  it('has name history', () => {
    expect(HistoryExtension.name).toBe('history')
  })
})
