import { Extension } from '@verso-editor/core'
import type { Node as PMNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

const URL_REGEX = /https?:\/\/[^\s<>\"']+/

/**
 * Find unlinked URLs in a text node and return link mark applications.
 */
function findUnlinkedURLs(
  node: PMNode,
  offset: number,
): Array<{ from: number; to: number; href: string }> {
  if (!node.isText || !node.text) return []

  const linkType = node.type.schema.marks.link
  if (!linkType) return []

  // Skip if already has a link mark
  if (node.marks.some((m) => m.type === linkType)) return []

  const matches: Array<{ from: number; to: number; href: string }> = []
  const text = node.text
  const regex = new RegExp(URL_REGEX.source, 'g')
  let match = regex.exec(text)
  while (match !== null) {
    const from = offset + match.index
    // Strip trailing punctuation that's unlikely part of the URL
    let href = match[0]
    href = href.replace(/[.,;:!?)\]>}]+$/, '')
    const adjustedTo = from + href.length
    matches.push({ from, to: adjustedTo, href })
    match = regex.exec(text)
  }

  return matches
}

export const AutolinkExtension = Extension.create({
  name: 'autolink',
  defaultOptions: {
    linkExtensionName: 'link',
  },
  plugins: [
    () => {
      const key = new PluginKey('autolink')
      return new Plugin({
        key,
        appendTransaction(transactions, _oldState, newState) {
          const docChanged = transactions.some((tr) => tr.docChanged)
          if (!docChanged) return null

          const { tr } = newState
          let changed = false

          newState.doc.descendants((node, pos) => {
            if (!node.isText) return

            const urls = findUnlinkedURLs(node, pos)
            for (const { from, to, href } of urls) {
              const linkMark = newState.schema.marks.link
              if (!linkMark) continue

              const hasLink = newState.doc.rangeHasMark(from, to, linkMark)
              if (hasLink) continue

              tr.addMark(from, to, linkMark.create({ href }))
              changed = true
            }
          })

          return changed ? tr : null
        },
      })
    },
  ],
})
