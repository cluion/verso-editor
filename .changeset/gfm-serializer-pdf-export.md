---
'@verso-editor/serializer-markdown': minor
'@verso-editor/extension-pdf-export': minor
'@verso-editor/core': patch
---

Add GFM Markdown serializer and PDF export extension

- **SerializerRegistry**: Extensible serializer architecture allowing extensions to register custom node/mark serializers
- **GFM Markdown**: Support for tables, task lists, strikethrough, autolinks, and footnotes in markdown serialization/parsing
- **PDF Export**: New `@verso-editor/extension-pdf-export` extension with page settings, header/footer, and progress callbacks
