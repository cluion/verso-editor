# Verso Editor

A headless, extensible rich text editor built on [ProseMirror](https://prosemirror.net/).

## Features

- **Headless** — no opinionated UI, bring your own toolbar and menus
- **Plugin-based** — 22 built-in extensions, write your own with the Extension API
- **Framework adapters** — React, Vue, and Svelte wrappers
- **Starter Kit** — one function to get bold, italic, headings, lists, links, and more
- **HTML Sanitization** — DOMPurify-powered XSS protection built in
- **Input Rules** — markdown-like shortcuts (`**bold**`, `*italic*`, `` `code` ``)
- **Accessibility** — ARIA labels and live region announcements
- **Serialization** — HTML, JSON, and Markdown serializers
- **TypeScript** — fully typed with exported types

## Quick Start

### Install

```bash
pnpm add @verso-editor/core @verso-editor/extension-starter-kit
```

### Usage

```typescript
import { Editor } from '@verso-editor/core'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

const element = document.getElementById('editor')!
const editor = new Editor({
  element,
  extensions: createStarterKit(),
  content: '<p>Hello world</p>',
})

// Get content
editor.getHTML()   // '<p>Hello world</p>'
editor.getJSON()   // { type: 'doc', content: [...] }

// Update content
editor.setContent('<h1>New title</h1>')

// Listen for changes
editor.on('update', (json) => {
  console.log('Content changed:', json)
})

// Clean up
editor.destroy()
```

### With React

```tsx
import { useEditor } from '@verso-editor/react'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

function EditorComponent() {
  const editor = useEditor({
    extensions: createStarterKit(),
    content: '<p>Hello from React</p>',
  })

  return <div ref={editor.ref} />
}
```

### With Vue

```vue
<script setup>
import { useEditor } from '@verso-editor/vue'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

const editor = useEditor({
  extensions: createStarterKit(),
  content: '<p>Hello from Vue</p>',
})
</script>

<template>
  <div ref="editor.ref" />
</template>
```

### With Svelte

```svelte
<script>
  import { useEditor } from '@verso-editor/svelte'
  import { createStarterKit } from '@verso-editor/extension-starter-kit'

  const editor = useEditor({
    extensions: createStarterKit(),
    content: '<p>Hello from Svelte</p>',
  })
</script>

<div bind:this={editor.ref} />
```

## Starter Kit Extensions

`createStarterKit()` includes 14 extensions. Pass `false` to exclude, or a custom extension to replace:

```typescript
import { createStarterKit } from '@verso-editor/extension-starter-kit'

// Exclude heading and history
createStarterKit({ heading: false, history: false })

// Replace bold with a custom implementation
createStarterKit({ bold: myCustomBoldExtension })
```

Included extensions:

| Extension | Package |
|-----------|---------|
| Bold | `@verso-editor/extension-bold` |
| Italic | `@verso-editor/extension-italic` |
| Code (inline) | `@verso-editor/extension-code` |
| Paragraph | `@verso-editor/extension-paragraph` |
| Heading | `@verso-editor/extension-heading` |
| Blockquote | `@verso-editor/extension-blockquote` |
| Horizontal Rule | `@verso-editor/extension-horizontal-rule` |
| Code Block | `@verso-editor/extension-code-block` |
| List Item | `@verso-editor/extension-list-item` |
| Bullet List | `@verso-editor/extension-bullet-list` |
| Ordered List | `@verso-editor/extension-ordered-list` |
| Link | `@verso-editor/extension-link` |
| Hard Break | `@verso-editor/extension-hard-break` |
| History (undo/redo) | `@verso-editor/extension-history` |

## Custom Extension

```typescript
import { MarkExtension, type Extension } from '@verso-editor/core'

const HighlightExtension = MarkExtension.create({
  name: 'highlight',
  markSpec: {
    parseDOM: [{ tag: 'mark' }],
    toDOM: () => ['mark', 0] as const,
  },
})

const editor = new Editor({
  element: document.getElementById('editor')!,
  extensions: [...createStarterKit(), HighlightExtension],
})
```

## Packages

| Package | Description |
|---------|-------------|
| `@verso-editor/core` | Editor engine, schema, sanitization |
| `@verso-editor/extension-*` | 22 individual extensions |
| `@verso-editor/extension-starter-kit` | Bundled starter kit |
| `@verso-editor/react` | React adapter |
| `@verso-editor/vue` | Vue adapter |
| `@verso-editor/svelte` | Svelte adapter |
| `@verso-editor/serializer-html` | HTML serializer |
| `@verso-editor/serializer-json` | JSON serializer |
| `@verso-editor/serializer-markdown` | Markdown serializer |
| `@verso-editor/bubble-menu` | Bubble menu UI |
| `@verso-editor/drag-handle` | Drag handle UI |
| `@verso-editor/slash-commands` | Slash commands UI |

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
