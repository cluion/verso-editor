# @verso-editor/extension-starter-kit

## 2.0.0

### Minor Changes

- [`aa2ca2e`](https://github.com/cluion/verso-editor/commit/aa2ca2e911712036cf9296c3dfcff9f7703dd8a6) Thanks [@cluion](https://github.com/cluion)! - Phase C-4: 企業級功能 — 10 個新 extension + Revision History

  ### 新增套件

  - **extension-track-changes**: 追蹤修訂（insertion/deletion marks、acceptChanges/rejectChanges、author/timestamp）
  - **extension-comment**: 評論批註（comment mark、addComment/removeComment、onClickComment callback）
  - **extension-restricted-editing**: 限制編輯（editable mark、filterTransaction 攔截不可編輯區域）
  - **extension-pagination**: 分頁檢視（CSS page break decorations、paginated/continuous 模式切換）
  - **extension-format-painter**: 格式複製刷（copyMarkFormat/pasteMarkFormat、Mod-Shift-c/v 快捷鍵）
  - **extension-fullscreen**: 全螢幕模式（toggleFullscreen、瀏覽器 Fullscreen API）
  - **extension-case-change**: 大小寫轉換（toUpperCase/toLowerCase/toTitleCase）
  - **extension-bookmark**: 書籤錨點（inline atom node、goToBookmark 跳轉）
  - **ui-context-menu**: 右鍵選單 UI 元件（可配置選單項目、點擊外部關閉）

  ### Core 變更

  - 新增 `revision.ts` 模組：createSnapshot、compareSnapshots、RevisionHistory class
  - Editor 加入 createSnapshot()、getRevisionHistory()、restoreRevision() 方法

  ### StarterKit 整合

  - createStarterKit 新增 12 個 extension 選項（trackChanges、comment、restrictedEditing、pagination、formatPainter、fullscreen、caseChange、bookmark 及對應 marks）

### Patch Changes

- Updated dependencies [[`aa2ca2e`](https://github.com/cluion/verso-editor/commit/aa2ca2e911712036cf9296c3dfcff9f7703dd8a6)]:
  - @verso-editor/core@0.3.0
  - @verso-editor/extension-track-changes@2.0.0
  - @verso-editor/extension-comment@2.0.0
  - @verso-editor/extension-restricted-editing@2.0.0
  - @verso-editor/extension-pagination@2.0.0
  - @verso-editor/extension-format-painter@2.0.0
  - @verso-editor/extension-fullscreen@2.0.0
  - @verso-editor/extension-case-change@2.0.0
  - @verso-editor/extension-bookmark@2.0.0
  - @verso-editor/extension-autolink@2.0.0
  - @verso-editor/extension-blockquote@2.0.0
  - @verso-editor/extension-bold@2.0.0
  - @verso-editor/extension-bullet-list@2.0.0
  - @verso-editor/extension-code@2.0.0
  - @verso-editor/extension-code-block@2.0.0
  - @verso-editor/extension-details@2.0.0
  - @verso-editor/extension-drop-cursor@2.0.0
  - @verso-editor/extension-file-embed@2.0.0
  - @verso-editor/extension-find-replace@2.0.0
  - @verso-editor/extension-font-family@2.0.0
  - @verso-editor/extension-font-size@2.0.0
  - @verso-editor/extension-footnote@2.0.0
  - @verso-editor/extension-gap-cursor@2.0.0
  - @verso-editor/extension-hard-break@2.0.0
  - @verso-editor/extension-heading@2.0.0
  - @verso-editor/extension-highlight@2.0.0
  - @verso-editor/extension-history@2.0.0
  - @verso-editor/extension-horizontal-rule@2.0.0
  - @verso-editor/extension-italic@2.0.0
  - @verso-editor/extension-link@2.0.0
  - @verso-editor/extension-list-item@2.0.0
  - @verso-editor/extension-math@2.0.0
  - @verso-editor/extension-mention@2.0.0
  - @verso-editor/extension-ordered-list@2.0.0
  - @verso-editor/extension-outline@2.0.0
  - @verso-editor/extension-paragraph@2.0.0
  - @verso-editor/extension-placeholder@2.0.0
  - @verso-editor/extension-print-view@2.0.0
  - @verso-editor/extension-rtl@2.0.0
  - @verso-editor/extension-strikethrough@2.0.0
  - @verso-editor/extension-subscript@2.0.0
  - @verso-editor/extension-superscript@2.0.0
  - @verso-editor/extension-task-list@2.0.0
  - @verso-editor/extension-text-align@2.0.0
  - @verso-editor/extension-text-color@2.0.0
  - @verso-editor/extension-typography@2.0.0
  - @verso-editor/extension-underline@2.0.0
  - @verso-editor/extension-video@2.0.0

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
  - @verso-editor/extension-math@1.0.0
  - @verso-editor/extension-details@1.0.0
  - @verso-editor/extension-footnote@1.0.0
  - @verso-editor/extension-find-replace@1.0.0
  - @verso-editor/extension-rtl@1.0.0
  - @verso-editor/extension-print-view@1.0.0
  - @verso-editor/extension-outline@1.0.0
  - @verso-editor/extension-paragraph@1.0.0
  - @verso-editor/extension-heading@1.0.0
  - @verso-editor/extension-autolink@1.0.0
  - @verso-editor/extension-blockquote@1.0.0
  - @verso-editor/extension-bold@1.0.0
  - @verso-editor/extension-bullet-list@1.0.0
  - @verso-editor/extension-code@1.0.0
  - @verso-editor/extension-code-block@1.0.0
  - @verso-editor/extension-drop-cursor@1.0.0
  - @verso-editor/extension-file-embed@1.0.0
  - @verso-editor/extension-font-family@1.0.0
  - @verso-editor/extension-font-size@1.0.0
  - @verso-editor/extension-gap-cursor@1.0.0
  - @verso-editor/extension-hard-break@1.0.0
  - @verso-editor/extension-highlight@1.0.0
  - @verso-editor/extension-history@1.0.0
  - @verso-editor/extension-horizontal-rule@1.0.0
  - @verso-editor/extension-italic@1.0.0
  - @verso-editor/extension-link@1.0.0
  - @verso-editor/extension-list-item@1.0.0
  - @verso-editor/extension-mention@1.0.0
  - @verso-editor/extension-ordered-list@1.0.0
  - @verso-editor/extension-placeholder@1.0.0
  - @verso-editor/extension-strikethrough@1.0.0
  - @verso-editor/extension-subscript@1.0.0
  - @verso-editor/extension-superscript@1.0.0
  - @verso-editor/extension-task-list@1.0.0
  - @verso-editor/extension-text-align@1.0.0
  - @verso-editor/extension-text-color@1.0.0
  - @verso-editor/extension-typography@1.0.0
  - @verso-editor/extension-underline@1.0.0
  - @verso-editor/extension-video@1.0.0

## 0.2.0

### Minor Changes

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

### Patch Changes

- Updated dependencies [[`669bf3a`](https://github.com/cluion/verso-editor/commit/669bf3a4ce295eb3d99301e2767f81235f95bb26)]:
  - @verso-editor/extension-autolink@0.2.0
  - @verso-editor/extension-mention@0.2.0
  - @verso-editor/extension-video@0.2.0
  - @verso-editor/extension-file-embed@0.2.0
  - @verso-editor/extension-typography@0.2.0
  - @verso-editor/extension-drop-cursor@0.2.0
  - @verso-editor/extension-gap-cursor@0.2.0
  - @verso-editor/extension-placeholder@0.2.0
  - @verso-editor/core@0.1.1
  - @verso-editor/extension-blockquote@0.1.0
  - @verso-editor/extension-bold@0.1.0
  - @verso-editor/extension-bullet-list@0.1.0
  - @verso-editor/extension-code@0.1.0
  - @verso-editor/extension-code-block@0.1.0
  - @verso-editor/extension-font-family@0.1.0
  - @verso-editor/extension-font-size@0.1.0
  - @verso-editor/extension-hard-break@0.1.0
  - @verso-editor/extension-heading@0.1.0
  - @verso-editor/extension-highlight@0.1.0
  - @verso-editor/extension-history@0.1.0
  - @verso-editor/extension-horizontal-rule@0.1.0
  - @verso-editor/extension-italic@0.1.0
  - @verso-editor/extension-link@0.1.0
  - @verso-editor/extension-list-item@0.1.0
  - @verso-editor/extension-ordered-list@0.1.0
  - @verso-editor/extension-paragraph@0.1.0
  - @verso-editor/extension-strikethrough@0.1.0
  - @verso-editor/extension-subscript@0.1.0
  - @verso-editor/extension-superscript@0.1.0
  - @verso-editor/extension-task-list@0.1.0
  - @verso-editor/extension-text-align@0.1.0
  - @verso-editor/extension-text-color@0.1.0
  - @verso-editor/extension-underline@0.1.0

## 0.1.0

### Minor Changes

- Initial 0.1.0 release with core editor, 22 extensions, framework adapters, serializers, and UI components.

### Patch Changes

- Updated dependencies
  - @verso-editor/core@0.1.0
  - @verso-editor/extension-bold@0.1.0
  - @verso-editor/extension-italic@0.1.0
  - @verso-editor/extension-code@0.1.0
  - @verso-editor/extension-paragraph@0.1.0
  - @verso-editor/extension-heading@0.1.0
  - @verso-editor/extension-blockquote@0.1.0
  - @verso-editor/extension-horizontal-rule@0.1.0
  - @verso-editor/extension-code-block@0.1.0
  - @verso-editor/extension-list-item@0.1.0
  - @verso-editor/extension-bullet-list@0.1.0
  - @verso-editor/extension-ordered-list@0.1.0
  - @verso-editor/extension-link@0.1.0
  - @verso-editor/extension-hard-break@0.1.0
  - @verso-editor/extension-history@0.1.0
