# API Reference

This section provides the API reference for Verso Editor packages.

## Core (`@verso-editor/core`)

### Editor

The main editor class.

```typescript
import { Editor } from '@verso-editor/core'
```

#### Constructor

```typescript
new Editor(options: EditorOptions)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `element` | `HTMLElement` | required | DOM element to mount into |
| `content` | `string` | `'<p></p>'` | Initial HTML content |
| `schema` | `Schema` | built-in | Custom ProseMirror schema |
| `plugins` | `Plugin[]` | `[]` | Additional ProseMirror plugins |
| `extensions` | `Extension[]` | `[]` | Verso extensions |
| `onError` | `(error: Error) => void` | `console.error` | Error handler callback |
| `ariaLabel` | `string` | `'Rich text editor'` | ARIA label for accessibility |

#### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `setContent` | `(html: string) => this` | Replace editor content |
| `getJSON` | `() => Record<string, unknown>` | Get document as JSON |
| `getHTML` | `() => string` | Get document as HTML |
| `insertContent` | `(html: string) => this` | Insert at selection |
| `on` | `(event, handler) => this` | Subscribe to event |
| `off` | `(event, handler) => this` | Unsubscribe from event |
| `destroy` | `() => void` | Clean up instance |
| `announce` | `(message: string) => void` | Screen reader announcement |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update` | `Record<string, unknown>` | Document changed |
| `focus` | — | Editor gained focus |
| `blur` | — | Editor lost focus |
| `destroy` | — | Editor destroyed |

### Extension Classes

```typescript
import { Extension, NodeExtension, MarkExtension } from '@verso-editor/core'
```

#### `Extension.create(config)`

Creates a generic extension with plugins, keymaps, and input rules.

#### `NodeExtension.create(config)`

Creates a node extension with a ProseMirror `NodeSpec`.

#### `MarkExtension.create(config)`

Creates a mark extension with a ProseMirror `MarkSpec`.

### Extension Configuration

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Unique extension name |
| `defaultOptions` | `Record<string, unknown>` | Default option values |
| `options` | `Partial<Options>` | Overridden option values |
| `dependencies` | `string[]` | Names of required extensions |
| `plugins` | `ExtensionPluginFactory[]` | ProseMirror plugin factories |
| `keymap` | `ExtensionKeymapFactory` | Keyboard shortcut factory |
| `inputRules` | `ExtensionInputRulesFactory` | Input rule factory |
| `commands` | `ExtensionCommands` | Named command functions |
| `nodeView` | `NodeViewFactory` | Custom DOM renderer |
| `nodeSpec` | `NodeSpec` | Node schema (NodeExtension only) |
| `markSpec` | `MarkSpec` | Mark schema (MarkExtension only) |

## Adapters

### React (`@verso-editor/react`)

```typescript
import { useEditor, EditorContent } from '@verso-editor/react'
```

| Export | Type | Description |
|--------|------|-------------|
| `useEditor` | `Hook` | Creates editor instance, returns `Editor \| null` |
| `EditorContent` | `Component` | Renders editor DOM into React tree |

### Vue 3 (`@verso-editor/vue`)

```typescript
import { useEditor, EditorContent } from '@verso-editor/vue'
```

| Export | Type | Description |
|--------|------|-------------|
| `useEditor` | `Composable` | Creates editor instance, returns `Ref<Editor \| null>` |
| `EditorContent` | `Component` | Renders editor DOM into Vue tree |

### Svelte (`@verso-editor/svelte`)

```typescript
import { createEditorStore } from '@verso-editor/svelte'
```

| Export | Type | Description |
|--------|------|-------------|
| `createEditorStore` | `Factory` | Creates `{ getEditor, onUpdate, destroy }` store |

## UI Packages

### Slash Commands (`@verso-editor/slash-commands`)

```typescript
import { createSlashCommandPlugin } from '@verso-editor/slash-commands'
```

| Export | Description |
|--------|-------------|
| `createSlashCommandPlugin(options)` | Creates ProseMirror plugin for slash command menu |
| `SlashCommandItem` | Interface: `{ title, description, command }` |
