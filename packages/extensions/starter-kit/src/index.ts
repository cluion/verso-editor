import type { Extension } from '@verso-editor/core'
import { BlockquoteExtension } from '@verso-editor/extension-blockquote'
import { BoldExtension } from '@verso-editor/extension-bold'
import { BulletListExtension } from '@verso-editor/extension-bullet-list'
import { CodeExtension } from '@verso-editor/extension-code'
import { CodeBlockExtension } from '@verso-editor/extension-code-block'
import { HardBreakExtension } from '@verso-editor/extension-hard-break'
import { HeadingExtension } from '@verso-editor/extension-heading'
import { HistoryExtension } from '@verso-editor/extension-history'
import { HorizontalRuleExtension } from '@verso-editor/extension-horizontal-rule'
import { ItalicExtension } from '@verso-editor/extension-italic'
import { LinkExtension } from '@verso-editor/extension-link'
import { ListItemExtension } from '@verso-editor/extension-list-item'
import { OrderedListExtension } from '@verso-editor/extension-ordered-list'
import { ParagraphExtension } from '@verso-editor/extension-paragraph'

interface StarterKitOptions {
  bold?: boolean | typeof BoldExtension
  italic?: boolean | typeof ItalicExtension
  code?: boolean | typeof CodeExtension
  paragraph?: boolean | typeof ParagraphExtension
  heading?: boolean | typeof HeadingExtension
  blockquote?: boolean | typeof BlockquoteExtension
  horizontalRule?: boolean | typeof HorizontalRuleExtension
  codeBlock?: boolean | typeof CodeBlockExtension
  bulletList?: boolean | typeof BulletListExtension
  orderedList?: boolean | typeof OrderedListExtension
  listItem?: boolean | typeof ListItemExtension
  link?: boolean | typeof LinkExtension
  hardBreak?: boolean | typeof HardBreakExtension
  history?: boolean | typeof HistoryExtension
}

export function createStarterKit(options: StarterKitOptions = {}): Extension[] {
  const extensions: Extension[] = []

  const all: [string, Extension][] = [
    ['bold', BoldExtension],
    ['italic', ItalicExtension],
    ['code', CodeExtension],
    ['paragraph', ParagraphExtension],
    ['heading', HeadingExtension],
    ['blockquote', BlockquoteExtension],
    ['horizontalRule', HorizontalRuleExtension],
    ['codeBlock', CodeBlockExtension],
    ['listItem', ListItemExtension],
    ['bulletList', BulletListExtension],
    ['orderedList', OrderedListExtension],
    ['link', LinkExtension],
    ['hardBreak', HardBreakExtension],
    ['history', HistoryExtension],
  ]

  for (const [key, ext] of all) {
    const value = options[key as keyof StarterKitOptions]
    if (value === false) continue
    if (typeof value === 'object' && value !== undefined) {
      extensions.push(value)
    } else {
      extensions.push(ext)
    }
  }

  return extensions
}
