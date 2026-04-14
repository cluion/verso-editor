import { describe, expect, it } from 'vitest'
import { VideoExtension } from '../index'

describe('VideoExtension', () => {
  it('has name video', () => {
    expect(VideoExtension.name).toBe('video')
  })

  it('has nodeSpec with block group', () => {
    expect(VideoExtension.nodeSpec).toBeDefined()
    expect(VideoExtension.nodeSpec.inline).toBe(false)
    expect(VideoExtension.nodeSpec.group).toBe('block')
  })

  it('has src, width, height attrs', () => {
    const attrs = VideoExtension.nodeSpec.attrs
    expect(attrs?.src).toBeDefined()
    expect(attrs?.width).toBeDefined()
    expect(attrs?.height).toBeDefined()
  })

  it('has parseDOM for iframe', () => {
    const rules = VideoExtension.nodeSpec.parseDOM
    expect(rules?.some((r) => (r as { tag: string }).tag === 'iframe')).toBe(true)
  })

  it('parseDOM rejects non-video iframe src', () => {
    const iframeRule = VideoExtension.nodeSpec.parseDOM?.find(
      (r) => (r as { tag: string }).tag === 'iframe',
    )
    // biome-ignore lint/suspicious/noExplicitAny: test convenience
    const getAttrs = (iframeRule as any).getAttrs
    expect(
      getAttrs({ getAttribute: (a: string) => (a === 'src' ? 'https://evil.com/embed' : null) }),
    ).toBe(false)
  })

  it('parseDOM accepts YouTube embed src', () => {
    const iframeRule = VideoExtension.nodeSpec.parseDOM?.find(
      (r) => (r as { tag: string }).tag === 'iframe',
    )
    // biome-ignore lint/suspicious/noExplicitAny: test convenience
    const getAttrs = (iframeRule as any).getAttrs
    const result = getAttrs({
      getAttribute: (a: string) => {
        if (a === 'src') return 'https://www.youtube.com/embed/abc'
        if (a === 'width') return '100%'
        if (a === 'height') return '315'
        return null
      },
    })
    expect(result.src).toBe('https://www.youtube.com/embed/abc')
  })

  it('has paste handler plugin', () => {
    expect(VideoExtension.plugins).toBeDefined()
    expect(VideoExtension.plugins.length).toBeGreaterThan(0)
  })
})
