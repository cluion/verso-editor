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
          width: (dom as HTMLElement).getAttribute('width'),
          height: (dom as HTMLElement).getAttribute('height'),
        }),
      },
    ],
  },
})
