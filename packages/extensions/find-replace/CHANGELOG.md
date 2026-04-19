# @verso-editor/extension-find-replace

## 1.0.0

### Minor Changes

- [`91ddb94`](https://github.com/cluion/verso-editor/commit/91ddb94d9f4b4bff9aca6660351220491d2a67fa) Thanks [@cluion](https://github.com/cluion)! - Phase C-3: 13 new packages for advanced features

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

### Patch Changes

- Updated dependencies [[`91ddb94`](https://github.com/cluion/verso-editor/commit/91ddb94d9f4b4bff9aca6660351220491d2a67fa)]:
  - @verso-editor/core@0.2.0
