# @verso-editor/extension-starter-kit

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
