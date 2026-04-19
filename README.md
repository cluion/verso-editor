# Verso Editor

A headless, extensible rich text editor built on [ProseMirror](https://prosemirror.net/).

## Features

- **Headless** — no opinionated UI, bring your own toolbar and menus
- **Plugin-based** — 46 built-in extensions, write your own with the Extension API
- **Framework adapters** — React, Vue, and Svelte wrappers
- **Starter Kit** — one function to get bold, italic, headings, lists, links, and more
- **HTML Sanitization** — DOMPurify-powered XSS protection built in
- **Input Rules** — markdown-like shortcuts (`**bold**`, `*italic*`, `` `code` ``)
- **Accessibility** — ARIA labels and live region announcements
- **Serialization** — HTML, JSON, and Markdown serializers
- **i18n** — built-in locale system with zh-TW, ja, en
- **Import/Export** — PDF export and Word (.docx) import
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

`createStarterKit()` includes 46 extensions. Pass `false` to exclude, or a custom extension to replace:

```typescript
import { createStarterKit } from '@verso-editor/extension-starter-kit'

// Exclude heading and history
createStarterKit({ heading: false, history: false })

// Replace bold with a custom implementation
createStarterKit({ bold: myCustomBoldExtension })
```

Included extensions:

### Marks

| Extension | Package |
|-----------|---------|
| Bold | `@verso-editor/extension-bold` |
| Italic | `@verso-editor/extension-italic` |
| Underline | `@verso-editor/extension-underline` |
| Strikethrough | `@verso-editor/extension-strikethrough` |
| Code (inline) | `@verso-editor/extension-code` |
| Subscript | `@verso-editor/extension-subscript` |
| Superscript | `@verso-editor/extension-superscript` |
| Link | `@verso-editor/extension-link` |
| Highlight | `@verso-editor/extension-highlight` |
| Text Color | `@verso-editor/extension-text-color` |

### Blocks

| Extension | Package |
|-----------|---------|
| Paragraph | `@verso-editor/extension-paragraph` |
| Heading | `@verso-editor/extension-heading` |
| Blockquote | `@verso-editor/extension-blockquote` |
| Horizontal Rule | `@verso-editor/extension-horizontal-rule` |
| Code Block | `@verso-editor/extension-code-block` |
| Bullet List | `@verso-editor/extension-bullet-list` |
| Ordered List | `@verso-editor/extension-ordered-list` |
| Task List | `@verso-editor/extension-task-list` |
| Image (with caption) | `@verso-editor/extension-image` |
| Table (with headers) | `@verso-editor/extension-table` |
| Video (YouTube/Vimeo) | `@verso-editor/extension-video` |
| File Embed | `@verso-editor/extension-file-embed` |

### Utilities

| Extension | Package |
|-----------|---------|
| History (undo/redo) | `@verso-editor/extension-history` |
| Hard Break | `@verso-editor/extension-hard-break` |
| Typography | `@verso-editor/extension-typography` |
| Autolink | `@verso-editor/extension-autolink` |
| Mention | `@verso-editor/extension-mention` |
| Placeholder | `@verso-editor/extension-placeholder` |
| Drop Cursor | `@verso-editor/extension-drop-cursor` |
| Gap Cursor | `@verso-editor/extension-gap-cursor` |
| Font Family | `@verso-editor/extension-font-family` |
| Font Size | `@verso-editor/extension-font-size` |
| Text Align | `@verso-editor/extension-text-align` |
| Character Count | `@verso-editor/extension-character-count` |
| List Item | `@verso-editor/extension-list-item` |

### Advanced (Phase C-3)

| Extension | Package | Description |
|-----------|---------|-------------|
| Math / LaTeX | `@verso-editor/extension-math` | KaTeX rendering, `$...$` inline / `$$...$$` block InputRules |
| Details / Accordion | `@verso-editor/extension-details` | Collapsible `<details>/<summary>` blocks |
| Footnotes | `@verso-editor/extension-footnote` | Inline references with auto-numbering and bidirectional links |
| Find & Replace | `@verso-editor/extension-find-replace` | Search highlight, regex, case-sensitive, replace/replaceAll |
| RTL Support | `@verso-editor/extension-rtl` | `dir` attribute toggle on paragraph/heading (`Mod-Alt-d`) |
| Print View | `@verso-editor/extension-print-view` | `@media print` CSS + `print()` command |
| Document Outline | `@verso-editor/extension-outline` | Heading extraction with `getOutline()` method |

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
| `@verso-editor/core` | Editor engine, schema, sanitization, locale system |
| `@verso-editor/extension-*` | 46 individual extensions |
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
| `@verso-editor/ui-emoji-picker` | Emoji picker UI with `:` suggestion |
| `@verso-editor/ui-special-chars` | Special characters panel (math, currency, arrows) |
| `@verso-editor/exporter-pdf` | PDF export via html2pdf.js |
| `@verso-editor/importer-docx` | Word (.docx) import via mammoth.js |
| `@verso-editor/templates` | Preset document templates |
| `@verso-editor/locales` | i18n locale files (en, zh-TW, ja) |

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## License

MIT
