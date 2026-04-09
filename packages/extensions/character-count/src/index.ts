import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'

export interface CharacterCountOptions {
  limit?: number
}

export interface CharacterCountState {
  characters: number
  words: number
  limit: number | undefined
  remaining: number
}

export const characterCountKey = new PluginKey('versoCharacterCount')

function countCharacters(doc: ProseMirrorNode): number {
  let count = 0
  doc.descendants((node) => {
    if (node.isText) {
      count += node.text?.length ?? 0
    }
  })
  return count
}

function countWords(doc: ProseMirrorNode): number {
  let text = ''
  doc.descendants((node) => {
    if (node.isText) {
      text += node.text ?? ''
    }
  })
  if (text.trim().length === 0) return 0
  return text.trim().split(/\s+/).length
}

export function createCharacterCountPlugin(options?: CharacterCountOptions): Plugin {
  const limit = options?.limit

  return new Plugin({
    key: characterCountKey,
    state: {
      init(_, state) {
        const characters = countCharacters(state.doc)
        const words = countWords(state.doc)
        return {
          characters,
          words,
          limit,
          remaining: limit !== undefined ? limit - characters : 0,
        } satisfies CharacterCountState
      },
      apply(tr, value, _oldState, newState) {
        if (!tr.docChanged) return value
        const characters = countCharacters(newState.doc)
        const words = countWords(newState.doc)
        return {
          characters,
          words,
          limit,
          remaining: limit !== undefined ? limit - characters : 0,
        } satisfies CharacterCountState
      },
    },
  })
}
