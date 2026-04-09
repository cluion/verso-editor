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
pnpm add @verso-editor/starter-kit
```

```bash [npm]
npm install @verso-editor/starter-kit
```

:::

```typescript
import { Editor } from '@verso-editor/core'
import { starterKit } from '@verso-editor/starter-kit'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [starterKit()],
})
```

StarterKit includes: bold, italic, code, heading, bullet list, ordered list, blockquote, code block, and history.

## Framework Adapters

### React

```bash
pnpm add @verso-editor/react
```

```tsx
import { useEditor, EditorContent } from '@verso-editor/react'

function App() {
  const editor = useEditor({ content: '<p>Hello!</p>' })

  if (!editor) return null

  return <EditorContent editor={editor} />
}
```

### Vue 3

```bash
pnpm add @verso-editor/vue
```

```vue
<script setup>
import { useEditor, EditorContent } from '@verso-editor/vue'

const editor = useEditor({ content: '<p>Hello!</p>' })
</script>

<template>
  <EditorContent :editor="editor" />
</template>
```

### Svelte

```bash
pnpm add @verso-editor/svelte
```

```svelte
<script>
import { createEditorStore } from '@verso-editor/svelte'

const store = createEditorStore({ content: '<p>Hello!</p>' })
</script>

<div bind:this={store.getEditor()?.view.dom.parentElement}></div>
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
