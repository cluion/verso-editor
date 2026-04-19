# Advanced Extensions (Phase C-3)

Verso Editor includes 13 additional packages for advanced features. These are all included in `createStarterKit()`.

## Math / LaTeX

Render mathematical formulas with KaTeX. Supports inline (`$...$`) and block (`$$...$$`) math via InputRules.

```typescript
import { MathExtension } from '@verso-editor/extension-math'
```

Type `$E=mc^2$` for inline math or `$$\frac{a}{b}$$` for display math. Click the rendered formula to edit the LaTeX source.

## Details / Accordion

Collapsible `<details>/<summary>` blocks.

```typescript
import {
  DetailsExtension,
  DetailsSummaryExtension,
  DetailsContentExtension,
} from '@verso-editor/extension-details'
```

Click the summary to toggle the `open` attribute.

## Footnotes

Inline footnote references with auto-numbering and a footnote section at the end of the document.

```typescript
import {
  FootnoteReferenceExtension,
  FootnotesPlugin,
} from '@verso-editor/extension-footnote'
```

The `FootnotesPlugin` automatically collects references and builds the footnote section.

## Find & Replace

Search and replace with decoration highlighting.

```typescript
import { FindReplaceExtension } from '@verso-editor/extension-find-replace'
```

Supports regex, case-sensitive options, and `replace()` / `replaceAll()` commands.

## RTL Support

Toggle text direction on paragraph and heading nodes with `Mod-Alt-d`.

```typescript
import { RtlExtension } from '@verso-editor/extension-rtl'
```

## Print View

Print-optimized CSS styles and a `print()` command.

```typescript
import { PrintViewExtension } from '@verso-editor/extension-print-view'
```

## Document Outline

Extract headings from the document for table-of-contents UI.

```typescript
import { OutlineExtension } from '@verso-editor/extension-outline'

const ext = OutlineExtension.configure({
  onUpdate: (outline) => {
    // [{ level: 1, text: 'Title', pos: 0, id: 'heading-0' }, ...]
  },
})
```

## PDF Export

Export editor content as PDF via html2pdf.js.

```typescript
import { exportPDF } from '@verso-editor/exporter-pdf'

await exportPDF(editor.getHTML(), { filename: 'doc.pdf' })
```

## Word Import

Import .docx files via mammoth.js.

```typescript
import { importDocx } from '@verso-editor/importer-docx'

const { html } = await importDocx(file)
editor.setContent(html)
```

## Emoji Picker

Suggestion plugin triggered by `:` with searchable emoji list.

```typescript
import { EmojiPickerExtension, searchEmojis, insertEmoji } from '@verso-editor/ui-emoji-picker'
```

## Special Characters

Categorized panel of math, currency, arrows, punctuation, and symbol characters.

```typescript
import { getSpecialChars, getCharCategories } from '@verso-editor/ui-special-chars'
```

## Templates

Preset document templates (blank, report, letter, meeting notes, blog post, README).

```typescript
import { getTemplateById } from '@verso-editor/templates'

const tpl = getTemplateById('report')
editor.setContent(tpl.html)
```

## i18n

Built-in locale system with en, zh-TW, and ja translations.

```typescript
import { setLocale } from '@verso-editor/core'
import { getLocaleMessages } from '@verso-editor/locales'

setLocale('zh-TW', getLocaleMessages('zh-TW'))
```
