import { Extension } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

export type EmojiPickerOptions = Record<string, unknown> & {
  char?: string
  onOpen?: (props: EmojiPickerProps) => void
  onClose?: () => void
}

export interface EmojiPickerProps {
  view: EditorView
  range: { from: number; to: number }
  query: string
}

export interface EmojiItem {
  emoji: string
  name: string
  category: string
  keywords: string[]
}

const EMOJI_LIST: EmojiItem[] = [
  { emoji: '😀', name: 'grinning', category: 'smileys', keywords: ['happy', 'smile'] },
  { emoji: '😃', name: 'smiley', category: 'smileys', keywords: ['happy'] },
  { emoji: '😄', name: 'smile', category: 'smileys', keywords: ['happy'] },
  { emoji: '😁', name: 'grin', category: 'smileys', keywords: ['happy'] },
  { emoji: '😂', name: 'joy', category: 'smileys', keywords: ['laugh', 'tear'] },
  { emoji: '🤣', name: 'rofl', category: 'smileys', keywords: ['laugh'] },
  { emoji: '😊', name: 'blush', category: 'smileys', keywords: ['shy'] },
  { emoji: '😇', name: 'innocent', category: 'smileys', keywords: ['angel'] },
  { emoji: '🙂', name: 'slightly_smiling', category: 'smileys', keywords: ['smile'] },
  { emoji: '😉', name: 'wink', category: 'smileys', keywords: ['wink'] },
  { emoji: '😍', name: 'heart_eyes', category: 'smileys', keywords: ['love'] },
  { emoji: '😘', name: 'kissing_heart', category: 'smileys', keywords: ['kiss'] },
  { emoji: '😎', name: 'sunglasses', category: 'smileys', keywords: ['cool'] },
  { emoji: '🤔', name: 'thinking', category: 'smileys', keywords: ['think'] },
  { emoji: '😢', name: 'cry', category: 'smileys', keywords: ['sad'] },
  { emoji: '👍', name: 'thumbsup', category: 'people', keywords: ['like', 'yes'] },
  { emoji: '👎', name: 'thumbsdown', category: 'people', keywords: ['dislike', 'no'] },
  { emoji: '👏', name: 'clap', category: 'people', keywords: ['applause'] },
  { emoji: '🙏', name: 'pray', category: 'people', keywords: ['please', 'thanks'] },
  { emoji: '❤️', name: 'heart', category: 'symbols', keywords: ['love', 'red'] },
  { emoji: '🔥', name: 'fire', category: 'nature', keywords: ['hot', 'lit'] },
  { emoji: '✅', name: 'check_mark', category: 'symbols', keywords: ['done', 'yes'] },
  { emoji: '❌', name: 'cross_mark', category: 'symbols', keywords: ['no', 'wrong'] },
  { emoji: '⭐', name: 'star', category: 'symbols', keywords: ['star', 'favorite'] },
  { emoji: '🎉', name: 'party', category: 'objects', keywords: ['celebrate'] },
  { emoji: '💯', name: '100', category: 'symbols', keywords: ['perfect', 'hundred'] },
]

export const EmojiPickerExtension = Extension.create<EmojiPickerOptions>({
  name: 'emojiPicker',
  defaultOptions: {
    char: ':',
    onOpen: undefined,
    onClose: undefined,
  } as EmojiPickerOptions,
  plugins: [
    () => {
      const key = new PluginKey('emojiSuggestion')
      return new Plugin({
        key,
        props: {
          handleKeyDown(_view, event) {
            if (event.key === 'Escape') {
              EmojiPickerExtension.options.onClose?.()
              return true
            }
            return false
          },
        },
        state: {
          init: () => ({}),
          apply(tr, _value, _oldState, _newState) {
            if (!tr.docChanged && !tr.selectionSet) return {}

            const $pos = tr.selection.$head
            const textBefore = $pos.parent.textContent.slice(0, $pos.parentOffset)
            const char = EmojiPickerExtension.options.char ?? ':'
            const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const match = textBefore.match(new RegExp(`${escapedChar}([a-zA-Z0-9_+-]*)$`))

            if (match) {
              const from = $pos.pos - match[0].length
              const to = $pos.pos
              const query = match[1]

              EmojiPickerExtension.options.onOpen?.({
                view: (tr as unknown as { view: EditorView }).view ?? null,
                range: { from, to },
                query,
              })
            } else {
              EmojiPickerExtension.options.onClose?.()
            }
            return {}
          },
        },
      })
    },
  ],
})

export function searchEmojis(query: string, limit = 20): EmojiItem[] {
  if (!query) return EMOJI_LIST.slice(0, limit)
  const lower = query.toLowerCase()
  return EMOJI_LIST.filter(
    (e) => e.name.includes(lower) || e.keywords.some((k) => k.includes(lower)),
  ).slice(0, limit)
}

export function insertEmoji(view: EditorView, range: { from: number; to: number }, emoji: string) {
  const tr = view.state.tr.delete(range.from, range.to).insertText(emoji, range.from)
  view.dispatch(tr)
}
