import { NodeExtension } from '@verso-editor/core'
import type { NodeViewFactory } from '@verso-editor/core'
import type { Node as PMNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

const YOUTUBE_MATCH = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
const VIMEO_MATCH = /vimeo\.com\/(\d+)/

/**
 * Convert a video URL to an embeddable iframe src.
 */
function toEmbedSrc(url: string): string | null {
  const ytMatch = url.match(YOUTUBE_MATCH)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`

  const vimeoMatch = url.match(VIMEO_MATCH)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return null
}

export const VideoExtension = NodeExtension.create({
  name: 'video',
  nodeSpec: {
    inline: false,
    group: 'block',
    attrs: {
      src: { default: '' },
      width: { default: '100%' },
      height: { default: '315' },
    },
    toDOM: (node) =>
      [
        'div',
        { class: 'verso-video-wrapper', 'data-type': 'video' },
        [
          'iframe',
          {
            src: node.attrs.src,
            width: node.attrs.width,
            height: node.attrs.height,
            frameborder: '0',
            allowfullscreen: 'true',
            allow:
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          },
        ],
      ] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'div[data-type="video"]',
        getAttrs: (dom) => {
          const iframe = (dom as HTMLElement).querySelector('iframe')
          return {
            src: iframe?.getAttribute('src') ?? '',
            width: iframe?.getAttribute('width') ?? '100%',
            height: iframe?.getAttribute('height') ?? '315',
          }
        },
      },
      {
        tag: 'iframe',
        getAttrs: (dom) => {
          const src = (dom as HTMLElement).getAttribute('src') ?? ''
          // Only allow known video hosts
          if (
            !src.startsWith('https://www.youtube.com/embed/') &&
            !src.startsWith('https://player.vimeo.com/video/')
          ) {
            return false
          }
          return {
            src,
            width: (dom as HTMLElement).getAttribute('width') ?? '100%',
            height: (dom as HTMLElement).getAttribute('height') ?? '315',
          }
        },
      },
    ],
  },
  plugins: [
    () => {
      const key = new PluginKey('videoPaste')
      return new Plugin({
        key,
        props: {
          handlePaste(view, _event, slice) {
            const text = slice.content.firstChild?.text
            if (!text) return false

            const embedSrc = toEmbedSrc(text)
            if (!embedSrc) return false

            const node = view.state.schema.nodes.video
            if (!node) return false

            const tr = view.state.tr.replaceSelectionWith(node.create({ src: embedSrc }))
            view.dispatch(tr)
            return true
          },
        },
      })
    },
  ],
})

export function createVideoNodeView(): NodeViewFactory {
  return (node: PMNode, _view: EditorView, _getPos: () => number | undefined) => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('verso-video-wrapper')
    wrapper.setAttribute('data-type', 'video')

    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', node.attrs.src ?? '')
    iframe.setAttribute('width', String(node.attrs.width ?? '100%'))
    iframe.setAttribute('height', String(node.attrs.height ?? '315'))
    iframe.setAttribute('frameborder', '0')
    iframe.setAttribute('allowfullscreen', 'true')
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    )

    wrapper.appendChild(iframe)

    return {
      dom: wrapper,

      update(updatedNode: PMNode) {
        if (updatedNode.type.name !== 'video') return false
        const src = updatedNode.attrs.src ?? ''
        if (iframe.getAttribute('src') !== src) {
          iframe.setAttribute('src', src)
        }
        iframe.setAttribute('width', String(updatedNode.attrs.width ?? '100%'))
        iframe.setAttribute('height', String(updatedNode.attrs.height ?? '315'))
        return true
      },

      selectNode() {
        wrapper.classList.add('verso-video--selected')
      },

      deselectNode() {
        wrapper.classList.remove('verso-video--selected')
      },

      destroy() {
        // iframe cleanup
      },

      ignoreMutation() {
        return true
      },
    }
  }
}
