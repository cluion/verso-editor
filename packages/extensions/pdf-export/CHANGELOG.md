# @verso-editor/extension-pdf-export

## 0.2.0

### Minor Changes

- [`ec9e291`](https://github.com/cluion/verso-editor/commit/ec9e29102fcd74baa7cb06da2ea5723b96d6ec06) Thanks [@cluion](https://github.com/cluion)! - Add GFM Markdown serializer and PDF export extension

  - **SerializerRegistry**: Extensible serializer architecture allowing extensions to register custom node/mark serializers
  - **GFM Markdown**: Support for tables, task lists, strikethrough, autolinks, and footnotes in markdown serialization/parsing
  - **PDF Export**: New `@verso-editor/extension-pdf-export` extension with page settings, header/footer, and progress callbacks
