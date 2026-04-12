import type { Extension } from '@verso-editor/core'
import { BlockquoteExtension } from '@verso-editor/extension-blockquote'
import { BoldExtension } from '@verso-editor/extension-bold'
import { BulletListExtension } from '@verso-editor/extension-bullet-list'
import { CodeExtension } from '@verso-editor/extension-code'
import { CodeBlockExtension } from '@verso-editor/extension-code-block'
import { FontFamilyExtension } from '@verso-editor/extension-font-family'
import { FontSizeExtension } from '@verso-editor/extension-font-size'
import { HardBreakExtension } from '@verso-editor/extension-hard-break'
import { HeadingExtension } from '@verso-editor/extension-heading'
import { HighlightExtension } from '@verso-editor/extension-highlight'
import { HistoryExtension } from '@verso-editor/extension-history'
import { HorizontalRuleExtension } from '@verso-editor/extension-horizontal-rule'
import { ItalicExtension } from '@verso-editor/extension-italic'
import { LinkExtension } from '@verso-editor/extension-link'
import { ListItemExtension } from '@verso-editor/extension-list-item'
import { OrderedListExtension } from '@verso-editor/extension-ordered-list'
import { ParagraphExtension } from '@verso-editor/extension-paragraph'
import { StrikethroughExtension } from '@verso-editor/extension-strikethrough'
import { SubscriptExtension } from '@verso-editor/extension-subscript'
import { SuperscriptExtension } from '@verso-editor/extension-superscript'
import { TaskItemExtension, TaskListExtension } from '@verso-editor/extension-task-list'
import { TextAlignExtension } from '@verso-editor/extension-text-align'
import { TextColorExtension } from '@verso-editor/extension-text-color'
import { UnderlineExtension } from '@verso-editor/extension-underline'

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
  underline?: boolean | typeof UnderlineExtension
  strikethrough?: boolean | typeof StrikethroughExtension
  subscript?: boolean | typeof SubscriptExtension
  superscript?: boolean | typeof SuperscriptExtension
  textColor?: boolean | typeof TextColorExtension
  highlight?: boolean | typeof HighlightExtension
  fontFamily?: boolean | typeof FontFamilyExtension
  fontSize?: boolean | typeof FontSizeExtension
  textAlign?: boolean | typeof TextAlignExtension
  taskList?: boolean | typeof TaskListExtension
  taskItem?: boolean | typeof TaskItemExtension
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
    ['underline', UnderlineExtension],
    ['strikethrough', StrikethroughExtension],
    ['subscript', SubscriptExtension],
    ['superscript', SuperscriptExtension],
    ['textColor', TextColorExtension],
    ['highlight', HighlightExtension],
    ['fontFamily', FontFamilyExtension],
    ['fontSize', FontSizeExtension],
    ['textAlign', TextAlignExtension],
    ['taskList', TaskListExtension],
    ['taskItem', TaskItemExtension],
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
