# @verso-editor/core

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
