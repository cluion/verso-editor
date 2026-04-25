# @verso-editor/extension-tag

Tag extension for Verso Editor. Provides `#tag` inline nodes with a suggestion trigger.

## Features

- Inline atom node with `id` and `label` attributes
- BEM-styled chip rendering (`.vs-tag` / `.vs-tag__label`)
- `#` trigger suggestion plugin (excludes line-start headings)
- `insertTag({ id, label })` command
- `getTags(editor)` helper to collect all tags from the document

## Install

```bash
pnpm add @verso-editor/extension-tag
```

## Usage

```typescript
import { TagExtension, insertTag, getTags } from '@verso-editor/extension-tag'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

// Included by default in StarterKit
const extensions = createStarterKit()

// Disable tag
const extensions = createStarterKit({ tag: false })

// With suggestion handler
const extensions = createStarterKit({
  tag: TagExtension.configure({
    onSuggestion: ({ view, range, query }) => {
      // Show suggestion popup filtered by query
    },
    onClose: () => {
      // Hide suggestion popup
    },
  }),
})

// Insert a tag programmatically
insertTag('tag-1', 'important')(editor.view, { from: 5, to: 10 })

// Get all tags from document
const tags = getTags(editor) // [{ id: 'tag-1', label: 'important' }, ...]
```
