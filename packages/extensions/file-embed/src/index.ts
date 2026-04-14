import { NodeExtension } from '@verso-editor/core'
import type { NodeViewFactory } from '@verso-editor/core'
import type { Node as PMNode } from 'prosemirror-model'

export const FileEmbedExtension = NodeExtension.create({
  name: 'file_embed',
  nodeSpec: {
    inline: false,
    group: 'block',
    attrs: {
      name: { default: '' },
      url: { default: '' },
      size: { default: '' },
      type: { default: '' },
    },
    toDOM: (node) =>
      [
        'div',
        {
          class: 'verso-file-embed',
          'data-type': 'file',
          'data-name': node.attrs.name,
          'data-url': node.attrs.url,
          'data-size': node.attrs.size,
          'data-file-type': node.attrs.type,
        },
        ['span', { class: 'verso-file-icon' }],
        ['span', { class: 'verso-file-name' }, node.attrs.name],
        ['span', { class: 'verso-file-size' }, node.attrs.size],
        [
          'a',
          {
            class: 'verso-file-download',
            href: node.attrs.url,
            download: node.attrs.name,
            target: '_blank',
          },
          'Download',
        ],
      ] as unknown as HTMLElement,
    parseDOM: [
      {
        tag: 'div[data-type="file"]',
        getAttrs: (dom) => ({
          name: (dom as HTMLElement).getAttribute('data-name') ?? '',
          url: (dom as HTMLElement).getAttribute('data-url') ?? '',
          size: (dom as HTMLElement).getAttribute('data-size') ?? '',
          type: (dom as HTMLElement).getAttribute('data-file-type') ?? '',
        }),
      },
    ],
  },
})

export function createFileEmbedNodeView(): NodeViewFactory {
  return (node: PMNode) => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('verso-file-embed')
    wrapper.setAttribute('data-type', 'file')

    const icon = document.createElement('span')
    icon.classList.add('verso-file-icon')
    icon.textContent = getFileIcon(node.attrs.type)

    const nameEl = document.createElement('span')
    nameEl.classList.add('verso-file-name')
    nameEl.textContent = node.attrs.name

    const sizeEl = document.createElement('span')
    sizeEl.classList.add('verso-file-size')
    sizeEl.textContent = formatFileSize(node.attrs.size)

    const downloadLink = document.createElement('a')
    downloadLink.classList.add('verso-file-download')
    downloadLink.setAttribute('href', node.attrs.url)
    downloadLink.setAttribute('download', node.attrs.name)
    downloadLink.setAttribute('target', '_blank')
    downloadLink.textContent = 'Download'

    wrapper.appendChild(icon)
    wrapper.appendChild(nameEl)
    wrapper.appendChild(sizeEl)
    wrapper.appendChild(downloadLink)

    return {
      dom: wrapper,

      update(updatedNode: PMNode) {
        if (updatedNode.type.name !== 'file_embed') return false
        nameEl.textContent = updatedNode.attrs.name
        sizeEl.textContent = formatFileSize(updatedNode.attrs.size)
        downloadLink.setAttribute('href', updatedNode.attrs.url)
        downloadLink.setAttribute('download', updatedNode.attrs.name)
        icon.textContent = getFileIcon(updatedNode.attrs.type)
        return true
      },

      selectNode() {
        wrapper.classList.add('verso-file-embed--selected')
      },

      deselectNode() {
        wrapper.classList.remove('verso-file-embed--selected')
      },

      destroy() {},

      ignoreMutation() {
        return true
      },
    }
  }
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼'
  if (mimeType.startsWith('video/')) return '🎬'
  if (mimeType.startsWith('audio/')) return '🎵'
  if (mimeType === 'application/pdf') return '📄'
  if (mimeType.includes('zip') || mimeType.includes('compress')) return '📦'
  return '📎'
}

function formatFileSize(size: string | number): string {
  const bytes = typeof size === 'number' ? size : Number.parseInt(size, 10)
  if (Number.isNaN(bytes) || bytes === 0) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let val = bytes
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024
    i++
  }
  return `${val.toFixed(1)} ${units[i]}`
}
