# @verso-editor/core

## 0.2.2

### Patch Changes

- [`da56130`](https://github.com/cluion/verso-editor/commit/da56130a70cebd8a28fa742dae53a4c7f1be394f) Thanks [@cluion](https://github.com/cluion)! - Add i18n and theme infrastructure

  - **I18n system**: New `I18n` class with `t(key, params?)`, `registerLocale()`, `setLocale()`, `onChange()`, fallback to English
  - **Default locales**: Built-in `en` and `zh-TW` translations for all UI components
  - **Theme system**: CSS Custom Properties design tokens (`--vs-*`) with light/dark themes
  - **Theme API**: `editor.setTheme('dark', overrides?)` with `prefers-color-scheme` auto-detection and localStorage persistence
  - **Theme CSS**: Import via `@verso-editor/core/theme.css`
  - **UI packages**: bubble-menu, slash-commands, drag-handle now use i18n for aria-labels and support runtime locale switching

## 0.2.1

### Patch Changes

- [`ec9e291`](https://github.com/cluion/verso-editor/commit/ec9e29102fcd74baa7cb06da2ea5723b96d6ec06) Thanks [@cluion](https://github.com/cluion)! - Add GFM Markdown serializer and PDF export extension

  - **SerializerRegistry**: Extensible serializer architecture allowing extensions to register custom node/mark serializers
  - **GFM Markdown**: Support for tables, task lists, strikethrough, autolinks, and footnotes in markdown serialization/parsing
  - **PDF Export**: New `@verso-editor/extension-pdf-export` extension with page settings, header/footer, and progress callbacks

## 0.2.0

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

## 0.1.1

### Patch Changes

- [`669bf3a`](https://github.com/cluion/verso-editor/commit/669bf3a4ce295eb3d99301e2767f81235f95bb26) Thanks [@cluion](https://github.com/cluion)! - Add 7 new extensions and enhance existing ones

  **New extensions:**

  - autolink — auto-detect URLs and apply link marks
  - mention — inline mention nodes with `@` trigger
  - video — embed YouTube/Vimeo videos with paste-to-embed
  - file-embed — file attachment cards with download links
  - typography — smart quotes, em dashes, ellipsis, arrows
  - drop-cursor — visual drop indicator during drag
  - gap-cursor — cursor in otherwise unreachable positions

  **Updates:**

  - image: caption support (`figure > img + figcaption`)
  - table: header row/column toggle (`<th>` support)
  - placeholder: full implementation with configurable options
  - starter-kit: now bundles 33 extensions
  - core: sanitize whitelist updated for iframe, figcaption, mention attrs

## 0.1.0

### Minor Changes

- Initial 0.1.0 release with core editor, 22 extensions, framework adapters, serializers, and UI components.
