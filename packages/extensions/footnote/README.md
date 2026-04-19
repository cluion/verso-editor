# @verso-editor/extension-footnote

Footnotes extension for Verso Editor. Provides inline footnote references with auto-numbering and a footnote section at the end of the document.

## Install

```bash
pnpm add @verso-editor/extension-footnote
```

## Usage

```typescript
import {
  FootnoteReferenceExtension,
  FootnoteSectionExtension,
  FootnoteItemExtension,
  FootnotesPlugin,
} from '@verso-editor/extension-footnote'
```

All nodes and the plugin are included in `createStarterKit()`. The plugin automatically collects `footnoteReference` nodes and builds a numbered `footnoteSection` at the end of the document.
