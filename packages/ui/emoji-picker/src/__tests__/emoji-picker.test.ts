import { describe, expect, it } from 'vitest'
import { EmojiPickerExtension, searchEmojis } from '../index'

describe('@verso-editor/ui-emoji-picker', () => {
  it('searchEmojis returns all with empty query', () => {
    const results = searchEmojis('')
    expect(results.length).toBeGreaterThan(0)
  })

  it('searchEmojis filters by name', () => {
    const results = searchEmojis('heart')
    expect(results.some((e) => e.name === 'heart')).toBe(true)
  })

  it('searchEmojis filters by keyword', () => {
    const results = searchEmojis('happy')
    expect(results.some((e) => e.name === 'grinning')).toBe(true)
  })

  it('searchEmojis respects limit', () => {
    const results = searchEmojis('', 5)
    expect(results.length).toBeLessThanOrEqual(5)
  })

  it('EmojiPickerExtension has correct name', () => {
    expect(EmojiPickerExtension.name).toBe('emojiPicker')
  })
})
