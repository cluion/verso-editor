# @verso-editor/core

Headless rich text editor engine built on [ProseMirror](https://prosemirror.net/).

## Install

```bash
pnpm add @verso-editor/core
```

## Usage

```typescript
import { Editor } from '@verso-editor/core'
import '@verso-editor/core/theme.css'

const editor = new Editor({
  element: document.getElementById('editor'),
  content: '<p>Hello world</p>',
  i18n: { locale: 'zh-TW' },
  theme: { persistTheme: true },
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
| `i18n` | `{ locale?: string }` | i18n configuration |
| `theme` | `{ defaultTheme?: string, persistTheme?: boolean }` | Theme configuration |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `setContent(html)` | `this` | Replace editor content |
| `insertContent(html)` | `this` | Insert HTML at selection |
| `getHTML()` | `string` | Get document as HTML |
| `getJSON()` | `object` | Get document as JSON |
| `on(event, handler)` | `this` | Subscribe to event |
| `off(event, handler)` | `this` | Unsubscribe from event |
| `setTheme(name, overrides?)` | `this` | Switch theme (`'light'`, `'dark'`, or custom) |
| `getTheme()` | `string` | Get current theme name |
| `destroy()` | `void` | Clean up instance |

### Events

- `update(json)` — content changed
- `focus()` — editor focused
- `blur()` — editor blurred
- `destroy()` — editor destroyed

## i18n

Built-in locale management with `en` and `zh-TW` defaults. Extensions access translations via `editor.i18n`.

```typescript
// Basic translation
editor.i18n.t('editor.ariaLabel') // → "Rich text editor"

// Parameterized translation
editor.i18n.t('characterCount.label', { count: 150 }) // → "150 characters"

// Register custom locale
editor.i18n.registerLocale('ja', { 'editor.ariaLabel': 'リッチテキストエディタ' })
editor.i18n.setLocale('ja')

// React to locale changes
editor.i18n.onChange((locale) => {
  console.log('Locale changed to:', locale)
})
```

## Theme

Theme tokens are CSS Custom Properties (`--vs-*`). Import the CSS and use `setTheme()` to switch.

```css
/* Available tokens */
--vs-bg-primary
--vs-bg-secondary
--vs-text-primary
--vs-text-secondary
--vs-accent
--vs-accent-hover
--vs-border
--vs-shadow
--vs-hover
--vs-active
--vs-disabled
--vs-menu-bg
--vs-menu-border
--vs-menu-shadow
--vs-menu-item-hover
--vs-menu-item-active
--vs-button-bg
--vs-button-hover
--vs-button-active-bg
--vs-button-active-text
```

```typescript
// Switch to dark theme
editor.setTheme('dark')

// Switch to light theme
editor.setTheme('light')

// Custom theme with overrides
editor.setTheme('custom', { '--vs-accent': '#e74c3c' })

// Auto-detect system preference (default behavior)
// No need to call setTheme — prefers-color-scheme is watched automatically

// Persist user preference across sessions
new Editor({ ..., theme: { persistTheme: true } })
```

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
