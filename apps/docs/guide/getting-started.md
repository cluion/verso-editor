# Getting Started

## Installation

Install the core editor package:

::: code-group

```bash [pnpm]
pnpm add @verso-editor/core
```

```bash [npm]
npm install @verso-editor/core
```

```bash [yarn]
yarn add @verso-editor/core
```

:::

## Basic Usage

Create an editor instance by providing a DOM element and optional content:

```typescript
import { Editor } from '@verso-editor/core'

const editor = new Editor({
  element: document.querySelector('#editor'),
  content: '<p>Hello, Verso!</p>',
})

// Listen for updates
editor.on('update', (json) => {
  console.log('Document changed:', json)
})

// Clean up when done
editor.destroy()
```

## StarterKit Quick Start

Install the StarterKit bundle for common extensions:

::: code-group

```bash [pnpm]
pnpm add @verso-editor/core @verso-editor/extension-starter-kit
```

```bash [npm]
npm install @verso-editor/core @verso-editor/extension-starter-kit
```

:::

```typescript
import { Editor } from '@verso-editor/core'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: createStarterKit(),
})
```

StarterKit includes 14 extensions: bold, italic, code, paragraph, heading, bullet list, ordered list, list item, blockquote, code block, horizontal rule, link, hard break, and history. You can exclude or replace any extension:

```typescript
// Exclude extensions
createStarterKit({ heading: false, history: false })

// Replace with a custom extension
createStarterKit({ bold: myCustomBoldExtension })
```

## Framework Adapters

### React

```bash
pnpm add @verso-editor/react @verso-editor/extension-starter-kit
```

```tsx
import { useEditor, EditorContent } from '@verso-editor/react'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

function App() {
  const editor = useEditor({
    extensions: createStarterKit(),
    content: '<p>Hello!</p>',
  })

  if (!editor) return null

  return <EditorContent editor={editor} />
}
```

### Vue 3

```bash
pnpm add @verso-editor/vue @verso-editor/extension-starter-kit
```

```vue
<script setup>
import { useEditor, EditorContent } from '@verso-editor/vue'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

const editor = useEditor({
  extensions: createStarterKit(),
  content: '<p>Hello!</p>',
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>
```

### Svelte

```bash
pnpm add @verso-editor/svelte @verso-editor/extension-starter-kit
```

```svelte
<script>
import { createEditorStore } from '@verso-editor/svelte'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

let container
const store = createEditorStore({
  element: container,
  extensions: createStarterKit(),
  content: '<p>Hello!</p>',
})
</script>

<div bind:this={container}></div>
```

## Editor API

| Method | Description |
|--------|-------------|
| `setContent(html)` | Replace editor content with HTML string |
| `getJSON()` | Get document as JSON |
| `getHTML()` | Get document as HTML string |
| `insertContent(html)` | Insert HTML at current selection |
| `on(event, handler)` | Subscribe to editor events |
| `off(event, handler)` | Unsubscribe from editor events |
| `destroy()` | Clean up editor instance |
| `announce(message)` | Announce message to screen readers |
