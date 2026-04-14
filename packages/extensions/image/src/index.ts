import { NodeExtension } from '@verso-editor/core'

export { createImageNodeView } from './image-nodeview'

export const ImageExtension = NodeExtension.create({
  name: 'image',
  nodeSpec: {
    inline: true,
    group: 'inline',
    attrs: {
      src: { default: '' },
      alt: { default: '' },
      title: { default: '' },
      width: { default: null },
      height: { default: null },
      caption: { default: '' },
    },
    draggable: true,
    toDOM: (node) => {
      const imgAttrs: Record<string, string> = { src: node.attrs.src ?? '' }
      if (node.attrs.alt) imgAttrs.alt = node.attrs.alt
      if (node.attrs.title) imgAttrs.title = node.attrs.title
      if (node.attrs.width) imgAttrs.width = String(node.attrs.width)
      if (node.attrs.height) imgAttrs.height = String(node.attrs.height)

      if (node.attrs.caption) {
        return [
          'figure',
          { 'data-type': 'image' },
          ['img', imgAttrs],
          ['figcaption', node.attrs.caption],
        ] as unknown as HTMLElement
      }
      return ['img', imgAttrs] as unknown as HTMLElement
    },
    parseDOM: [
      {
        tag: 'figure[data-type="image"]',
        getAttrs: (dom) => {
          const el = dom as HTMLElement
          const img = el.querySelector('img')
          const caption = el.querySelector('figcaption')
          return {
            src: img?.getAttribute('src') ?? '',
            alt: img?.getAttribute('alt') ?? '',
            title: img?.getAttribute('title') ?? '',
            width: img?.getAttribute('width'),
            height: img?.getAttribute('height'),
            caption: caption?.textContent ?? '',
          }
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (dom) => ({
          src: (dom as HTMLElement).getAttribute('src') ?? '',
          alt: (dom as HTMLElement).getAttribute('alt') ?? '',
          title: (dom as HTMLElement).getAttribute('title') ?? '',
          width: (dom as HTMLElement).getAttribute('width'),
          height: (dom as HTMLElement).getAttribute('height'),
          caption: '',
        }),
      },
    ],
  },
})
