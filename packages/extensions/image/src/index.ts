import { NodeExtension } from '@verso-editor/core'

export const ImageExtension = NodeExtension.create({
  name: 'image',
  nodeSpec: {
    inline: true,
    group: 'inline',
    attrs: {
      src: { default: '' },
      alt: { default: '' },
      title: { default: '' },
    },
    draggable: true,
    toDOM: (node) => ['img', node.attrs] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs: (dom) => ({
          src: (dom as HTMLElement).getAttribute('src') ?? '',
          alt: (dom as HTMLElement).getAttribute('alt') ?? '',
          title: (dom as HTMLElement).getAttribute('title') ?? '',
        }),
      },
    ],
  },
})
