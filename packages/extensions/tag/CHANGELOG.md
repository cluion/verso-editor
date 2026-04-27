# @verso-editor/extension-tag

## 1.1.0

### Minor Changes

- [`d5dc2ac`](https://github.com/cluion/verso-editor/commit/d5dc2ac9e5f4223cae25f075c09e69743597ac63) Thanks [@cluion](https://github.com/cluion)! - Add Mermaid diagram and Tag extensions

  - **Mermaid Extension**: Renders mermaid diagrams from code blocks with dynamic import, source/preview toggle, loading spinner, and error handling for invalid syntax
  - **Tag Extension**: Inline #tag nodes with BEM-styled chip rendering, # trigger suggestion plugin, insertTag command, and getTags helper
  - **StarterKit**: Both extensions included by default, disable via `{ mermaid: false }` or `{ tag: false }`
