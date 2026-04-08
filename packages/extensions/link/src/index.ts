import { MarkExtension } from '@verso-editor/core'

export const LinkExtension = MarkExtension.create({
  name: 'link',
  markSpec: {
    attrs: { href: { default: '' } },
    inclusive: true,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs: (dom) => {
          const href = (dom as HTMLElement).getAttribute('href') ?? ''
          const protocol = href.replace(/:.*/, '').toLowerCase()
          if (['javascript', 'data', 'vbscript'].includes(protocol)) return false
          return { href }
        },
      },
    ],
    toDOM: (mark) => ['a', { href: mark.attrs.href }, 0] as unknown as HTMLElement,
  },
})
