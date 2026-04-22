import { describe, expect, it } from 'vitest'
import { CommentExtension, CommentMark } from '../index'

describe('CommentMark', () => {
  it('has name comment', () => {
    expect(CommentMark.name).toBe('comment')
  })

  it('has markSpec with parseDOM and toDOM', () => {
    expect(CommentMark.markSpec.parseDOM).toBeDefined()
    expect(CommentMark.markSpec.toDOM).toBeDefined()
  })
})

describe('CommentExtension', () => {
  it('has name comment', () => {
    expect(CommentExtension.name).toBe('comment')
  })

  it('has default onClickComment option as null', () => {
    expect(CommentExtension.options.onClickComment).toBeNull()
  })
})
