import type { Extension } from '@verso-editor/core'
import { AutolinkExtension } from '@verso-editor/extension-autolink'
import { BlockquoteExtension } from '@verso-editor/extension-blockquote'
import { BoldExtension } from '@verso-editor/extension-bold'
import { BookmarkExtension } from '@verso-editor/extension-bookmark'
import { BulletListExtension } from '@verso-editor/extension-bullet-list'
import { CaseChangeExtension } from '@verso-editor/extension-case-change'
import { CodeExtension } from '@verso-editor/extension-code'
import { CodeBlockExtension } from '@verso-editor/extension-code-block'
import { CommentExtension, CommentMark } from '@verso-editor/extension-comment'
import {
  DetailsContentExtension,
  DetailsExtension,
  DetailsSummaryExtension,
} from '@verso-editor/extension-details'
import { DropCursorExtension } from '@verso-editor/extension-drop-cursor'
import { FileEmbedExtension } from '@verso-editor/extension-file-embed'
import { FindReplaceExtension } from '@verso-editor/extension-find-replace'
import { FontFamilyExtension } from '@verso-editor/extension-font-family'
import { FontSizeExtension } from '@verso-editor/extension-font-size'
import {
  FootnoteItemExtension,
  FootnoteReferenceExtension,
  FootnoteSectionExtension,
  FootnotesPlugin,
} from '@verso-editor/extension-footnote'
import { FormatPainterExtension } from '@verso-editor/extension-format-painter'
import { FullscreenExtension } from '@verso-editor/extension-fullscreen'
import { GapCursorExtension } from '@verso-editor/extension-gap-cursor'
import { HardBreakExtension } from '@verso-editor/extension-hard-break'
import { HeadingExtension } from '@verso-editor/extension-heading'
import { HighlightExtension } from '@verso-editor/extension-highlight'
import { HistoryExtension } from '@verso-editor/extension-history'
import { HorizontalRuleExtension } from '@verso-editor/extension-horizontal-rule'
import { ItalicExtension } from '@verso-editor/extension-italic'
import { LinkExtension } from '@verso-editor/extension-link'
import { ListItemExtension } from '@verso-editor/extension-list-item'
import { MathExtension } from '@verso-editor/extension-math'
import { MentionExtension } from '@verso-editor/extension-mention'
import { OrderedListExtension } from '@verso-editor/extension-ordered-list'
import { OutlineExtension } from '@verso-editor/extension-outline'
import { PaginationExtension } from '@verso-editor/extension-pagination'
import { ParagraphExtension } from '@verso-editor/extension-paragraph'
import { PlaceholderExtension } from '@verso-editor/extension-placeholder'
import { PrintViewExtension } from '@verso-editor/extension-print-view'
import {
  EditableMark,
  RestrictedEditingExtension,
} from '@verso-editor/extension-restricted-editing'
import { RtlExtension } from '@verso-editor/extension-rtl'
import { StrikethroughExtension } from '@verso-editor/extension-strikethrough'
import { SubscriptExtension } from '@verso-editor/extension-subscript'
import { SuperscriptExtension } from '@verso-editor/extension-superscript'
import { TaskItemExtension, TaskListExtension } from '@verso-editor/extension-task-list'
import { TextAlignExtension } from '@verso-editor/extension-text-align'
import { TextColorExtension } from '@verso-editor/extension-text-color'
import {
  DeletionMark,
  InsertionMark,
  TrackChangesExtension,
} from '@verso-editor/extension-track-changes'
import { TypographyExtension } from '@verso-editor/extension-typography'
import { UnderlineExtension } from '@verso-editor/extension-underline'
import { VideoExtension } from '@verso-editor/extension-video'

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
  // Phase C-2 additions
  autolink?: boolean | typeof AutolinkExtension
  mention?: boolean | typeof MentionExtension
  video?: boolean | typeof VideoExtension
  fileEmbed?: boolean | typeof FileEmbedExtension
  typography?: boolean | typeof TypographyExtension
  dropCursor?: boolean | typeof DropCursorExtension
  gapCursor?: boolean | typeof GapCursorExtension
  placeholder?: boolean | typeof PlaceholderExtension
  // Phase C-3 additions
  math?: boolean | typeof MathExtension
  details?: boolean | typeof DetailsExtension
  footnote?: boolean | typeof FootnoteReferenceExtension
  findReplace?: boolean | typeof FindReplaceExtension
  rtl?: boolean | typeof RtlExtension
  printView?: boolean | typeof PrintViewExtension
  outline?: boolean | typeof OutlineExtension
  // Phase C-4 additions
  trackChanges?: boolean | typeof TrackChangesExtension
  comment?: boolean | typeof CommentExtension
  restrictedEditing?: boolean | typeof RestrictedEditingExtension
  pagination?: boolean | typeof PaginationExtension
  formatPainter?: boolean | typeof FormatPainterExtension
  fullscreen?: boolean | typeof FullscreenExtension
  caseChange?: boolean | typeof CaseChangeExtension
  bookmark?: boolean | typeof BookmarkExtension
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
    // Phase C-2 additions
    ['autolink', AutolinkExtension],
    ['mention', MentionExtension],
    ['video', VideoExtension],
    ['fileEmbed', FileEmbedExtension],
    ['typography', TypographyExtension],
    ['dropCursor', DropCursorExtension],
    ['gapCursor', GapCursorExtension],
    ['placeholder', PlaceholderExtension],
    // Phase C-3 additions
    ['math', MathExtension],
    ['details', DetailsExtension],
    ['detailsSummary', DetailsSummaryExtension],
    ['detailsContent', DetailsContentExtension],
    ['footnoteReference', FootnoteReferenceExtension],
    ['footnoteSection', FootnoteSectionExtension],
    ['footnoteItem', FootnoteItemExtension],
    ['footnotes', FootnotesPlugin],
    ['findReplace', FindReplaceExtension],
    ['rtl', RtlExtension],
    ['printView', PrintViewExtension],
    ['outline', OutlineExtension],
    // Phase C-4 additions
    ['insertionMark', InsertionMark],
    ['deletionMark', DeletionMark],
    ['trackChanges', TrackChangesExtension],
    ['commentMark', CommentMark],
    ['comment', CommentExtension],
    ['editableMark', EditableMark],
    ['restrictedEditing', RestrictedEditingExtension],
    ['pagination', PaginationExtension],
    ['formatPainter', FormatPainterExtension],
    ['fullscreen', FullscreenExtension],
    ['caseChange', CaseChangeExtension],
    ['bookmark', BookmarkExtension],
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
