---
"@verso-editor/core": minor
"@verso-editor/extension-math": minor
"@verso-editor/extension-details": minor
"@verso-editor/extension-footnote": minor
"@verso-editor/extension-find-replace": minor
"@verso-editor/extension-rtl": minor
"@verso-editor/extension-print-view": minor
"@verso-editor/extension-outline": minor
"@verso-editor/extension-starter-kit": minor
"@verso-editor/extension-paragraph": minor
"@verso-editor/extension-heading": minor
"@verso-editor/exporter-pdf": minor
"@verso-editor/importer-docx": minor
"@verso-editor/templates": minor
"@verso-editor/locales": minor
"@verso-editor/ui-emoji-picker": minor
"@verso-editor/ui-special-chars": minor
---

Phase C-3: 13 new packages for advanced features

- **Math/LaTeX** — KaTeX rendering with inline `$...$` and block `$$...$$` InputRules, click-to-edit NodeView
- **Emoji Picker** — Suggestion plugin triggered by `:`, searchable emoji list
- **Details/Accordion** — Collapsible `<details>/<summary>` blocks with toggle NodeView
- **Footnotes** — Inline references with auto-numbering, footnote section collection, and bidirectional links
- **Find & Replace** — Search highlight decorations, regex/case-sensitive options, replace/replaceAll commands
- **i18n** — Core locale system (`setLocale`/`t()`) + locales package (en, zh-TW, ja)
- **RTL Support** — `dir` attribute on paragraph/heading, `Mod-Alt-d` keymap to toggle direction
- **Print View** — `@media print` CSS styles + `print()` command
- **PDF Export** — `exportPDF()` API powered by html2pdf.js
- **Word Import** — `importDocx()` API powered by mammoth.js
- **Document Outline** — Plugin that monitors headings and provides `getOutline()` method
- **Templates** — Preset template library (blank, report, letter, meeting notes, blog post, README)
- **Special Characters** — Categorized panel with math, currency, arrows, punctuation, and symbols
