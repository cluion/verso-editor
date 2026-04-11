# Quick Start

Get a fully functional rich text editor running in under a minute.

## Install

```bash
pnpm add @verso-editor/core @verso-editor/extension-starter-kit
```

## Minimal Example

```typescript
import { Editor } from '@verso-editor/core'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

const editor = new Editor({
  element: document.getElementById('editor')!,
  extensions: createStarterKit(),
  content: '<p>Start editing...</p>',
})
```

That's it. You now have an editor with bold, italic, headings, lists, links, undo/redo, and more.

## Input Rules

Type markdown-like shortcuts:

| Shortcut | Result |
|----------|--------|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `` `code` `` | `code` |

## Get / Set Content

```typescript
editor.getHTML()                   // '<p>Start editing...</p>'
editor.getJSON()                   // { type: 'doc', content: [...] }
editor.setContent('<h1>New</h1>')  // replace content
```

## Next Steps

- [Getting Started](/guide/getting-started) — full installation and API docs
- [Extensions](/guide/extensions) — all available extensions
