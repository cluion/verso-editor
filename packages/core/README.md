# @verso-editor/core

Headless rich text editor engine built on [ProseMirror](https://prosemirror.net/).

## Install

```bash
pnpm add @verso-editor/core
```

## Usage

```typescript
import { Editor } from '@verso-editor/core'

const editor = new Editor({
  element: document.getElementById('editor'),
  content: '<p>Hello world</p>',
})

editor.getHTML()  // '<p>Hello world</p>'
editor.getJSON()  // { type: 'doc', content: [...] }

editor.on('update', (json) => {
  console.log('Changed:', json)
})

editor.destroy()
```

## API

### Constructor

```typescript
new Editor(options: EditorOptions)
```

| Option | Type | Description |
|--------|------|-------------|
| `element` | `HTMLElement` | DOM element to mount into |
| `content` | `string` | Initial HTML content |
| `extensions` | `Extension[]` | Extensions to register |
| `schema` | `Schema` | Custom ProseMirror schema |
| `plugins` | `Plugin[]` | Additional ProseMirror plugins |
| `onError` | `(error: Error) => void` | Error handler |
| `ariaLabel` | `string` | ARIA label for accessibility |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `setContent(html)` | `this` | Replace editor content |
| `insertContent(html)` | `this` | Insert HTML at selection |
| `getHTML()` | `string` | Get document as HTML |
| `getJSON()` | `object` | Get document as JSON |
| `on(event, handler)` | `this` | Subscribe to event |
| `off(event, handler)` | `this` | Unsubscribe from event |
| `destroy()` | `void` | Clean up instance |

### Events

- `update(json)` — content changed
- `focus()` — editor focused
- `blur()` — editor blurred
- `destroy()` — editor destroyed

## Custom Extensions

```typescript
import { MarkExtension, NodeExtension } from '@verso-editor/core'

const HighlightExtension = MarkExtension.create({
  name: 'highlight',
  markSpec: {
    parseDOM: [{ tag: 'mark' }],
    toDOM: () => ['mark', 0] as const,
  },
})

const CalloutExtension = NodeExtension.create({
  name: 'callout',
  nodeSpec: {
    content: 'inline*',
    toDOM: () => ['div', { class: 'callout' }, 0] as const,
  },
})
```

## HTML Sanitization

Content is sanitized via DOMPurify on every `setContent` and `insertContent` call:

```typescript
import { sanitizeHTML } from '@verso-editor/core'

sanitizeHTML('<p>safe</p><script>alert(1)</script>')
// '<p>safe</p>'
```

## Related Packages

- [`@verso-editor/extension-starter-kit`](https://www.npmjs.com/package/@verso-editor/extension-starter-kit) — bundled starter extensions
- [`@verso-editor/react`](https://www.npmjs.com/package/@verso-editor/react) — React adapter
- [`@verso-editor/vue`](https://www.npmjs.com/package/@verso-editor/vue) — Vue adapter
- [`@verso-editor/svelte`](https://www.npmjs.com/package/@verso-editor/svelte) — Svelte adapter

## License

MIT
