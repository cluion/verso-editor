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

### Command Helpers

```typescript
import {
  createToggleMark,
  createSetBlockType,
  createToggleBlockType,
  createWrapIn,
  createLift,
  isMarkActive,
  isNodeActive,
} from '@verso-editor/core'
```

| Helper | Description |
|--------|-------------|
| `createToggleMark(schema, markName)` | Create a toggle mark command |
| `createSetBlockType(schema, nodeName, attrs)` | Create a set block type command |
| `createToggleBlockType(schema, nodeName, attrs)` | Create a toggle block type command |
| `createWrapIn(schema, nodeName)` | Create a wrap-in command |
| `createLift(schema)` | Create a lift command |
| `isMarkActive(state, markName)` | Check if mark is active |
| `isNodeActive(state, nodeName, attrs)` | Check if node is active |

### Schema

```typescript
import { defaultSchema, defaultNodeSpecs, defaultMarkSpecs, resolveSchema } from '@verso-editor/core'
```

| Export | Description |
|--------|-------------|
| `defaultSchema` | Default ProseMirror schema |
| `defaultNodeSpecs` | Default node specifications |
| `defaultMarkSpecs` | Default mark specifications |
| `resolveSchema(extensions)` | Resolve schema from extensions |

### Sanitization

```typescript
import { sanitizeHTML, type SanitizeOptions } from '@verso-editor/core'
```

#### `sanitizeHTML(html, options?)`

Sanitize HTML content to prevent XSS attacks. Strips `<script>`, event handlers, and `javascript:` protocols while preserving safe editor content.

```typescript
const clean = sanitizeHTML('<p>Hello</p><script>alert("xss")</script>')
// '<p>Hello</p>'
```

#### `SanitizeOptions`

| Option | Type | Description |
|--------|------|-------------|
| `allowedTags` | `string[]` | Override default allowed tags |
| `allowedAttributes` | `Record<string, string[]>` | Override default allowed attributes |

This is applied automatically when using `setContent()` and `insertContent()`.

### Locale / i18n

```typescript
import { setLocale, getLocale, t } from '@verso-editor/core'
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `setLocale` | `(locale: string, messages: Record<string, string>) => void` | Set current locale and messages |
| `getLocale` | `() => string` | Get current locale code |
| `t` | `(key: string, params?) => string` | Translate a key with optional params |

```typescript
import { getLocaleMessages } from '@verso-editor/locales'

// Switch to Traditional Chinese
setLocale('zh-TW', getLocaleMessages('zh-TW'))
t('toolbar.bold') // '粗體'

// Parameter interpolation
t('find.results', { count: 5 }) // '5 個結果'
```

### Other Core Exports

| Export | Description |
|--------|-------------|
| `EventEmitter` | Event emitter used by Editor |
| `createInputRulesPlugin` | Create ProseMirror input rules plugin |
| `createKeymapPlugins` | Create ProseMirror keymap plugins |
| `sortExtensions` | Sort extensions by dependencies |

---

## Adapters

### React (`@verso-editor/react`)

```typescript
import { useEditor, EditorContent } from '@verso-editor/react'
```

| Export | Type | Description |
|--------|------|-------------|
| `useEditor` | `Hook` | Creates editor instance, returns `Editor | null` |
| `EditorContent` | `Component` | Renders editor DOM into React tree |

### Vue 3 (`@verso-editor/vue`)

```typescript
import { useEditor, EditorContent } from '@verso-editor/vue'
```

| Export | Type | Description |
|--------|------|-------------|
| `useEditor` | `Composable` | Creates editor instance, returns `Ref<Editor | null>` |
| `EditorContent` | `Component` | Renders editor DOM into Vue tree |

### Svelte (`@verso-editor/svelte`)

```typescript
import { createEditorStore } from '@verso-editor/svelte'
```

| Export | Type | Description |
|--------|------|-------------|
| `createEditorStore` | `Factory` | Creates `{ getEditor, onUpdate, destroy }` store |

---

## StarterKit (`@verso-editor/extension-starter-kit`)

```typescript
import { createStarterKit } from '@verso-editor/extension-starter-kit'
```

### `createStarterKit(options?)`

Returns an array of 45 extensions. Each extension can be disabled (`false`) or replaced with a custom implementation.

```typescript
// Default — all extensions
createStarterKit()

// Exclude extensions
createStarterKit({ heading: false, history: false })

// Replace with custom
createStarterKit({ bold: myCustomBoldExtension })
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `bold` | `BoldExtension` | Bold formatting |
| `italic` | `ItalicExtension` | Italic formatting |
| `code` | `CodeExtension` | Inline code |
| `paragraph` | `ParagraphExtension` | Paragraph blocks |
| `heading` | `HeadingExtension` | H1–H6 headings |
| `blockquote` | `BlockquoteExtension` | Block quotes |
| `horizontalRule` | `HorizontalRuleExtension` | Horizontal rules |
| `codeBlock` | `CodeBlockExtension` | Code blocks |
| `listItem` | `ListItemExtension` | List items |
| `bulletList` | `BulletListExtension` | Bullet lists |
| `orderedList` | `OrderedListExtension` | Ordered lists |
| `link` | `LinkExtension` | Hyperlinks |
| `hardBreak` | `HardBreakExtension` | Hard breaks |
| `history` | `HistoryExtension` | Undo/redo |
| `underline` | `UnderlineExtension` | Underline |
| `strikethrough` | `StrikethroughExtension` | Strikethrough |
| `subscript` | `SubscriptExtension` | Subscript |
| `superscript` | `SuperscriptExtension` | Superscript |
| `textColor` | `TextColorExtension` | Text color |
| `highlight` | `HighlightExtension` | Highlight |
| `fontFamily` | `FontFamilyExtension` | Font family |
| `fontSize` | `FontSizeExtension` | Font size |
| `textAlign` | `TextAlignExtension` | Text alignment |
| `taskList` | `TaskListExtension` | Task list |
| `taskItem` | `TaskItemExtension` | Task item |
| `autolink` | `AutolinkExtension` | Auto-detect URLs |
| `mention` | `MentionExtension` | @mention |
| `video` | `VideoExtension` | Video embeds |
| `fileEmbed` | `FileEmbedExtension` | File embeds |
| `typography` | `TypographyExtension` | Smart typography |
| `dropCursor` | `DropCursorExtension` | Drop cursor |
| `gapCursor` | `GapCursorExtension` | Gap cursor |
| `placeholder` | `PlaceholderExtension` | Placeholder text |
| `math` | `MathExtension` | LaTeX math |
| `details` | `DetailsExtension` | Collapsible blocks |
| `footnote` | `FootnoteReferenceExtension` | Footnotes |
| `findReplace` | `FindReplaceExtension` | Find & replace |
| `rtl` | `RtlExtension` | RTL support |
| `printView` | `PrintViewExtension` | Print view |
| `outline` | `OutlineExtension` | Document outline |

---

## UI Packages

### Slash Commands (`@verso-editor/slash-commands`)

```typescript
import { createSlashCommandPlugin } from '@verso-editor/slash-commands'
```

| Export | Description |
|--------|-------------|
| `createSlashCommandPlugin(options)` | Creates ProseMirror plugin for slash command menu |
| `SlashCommandItem` | Interface: `{ title, description, command }` |

### Bubble Menu (`@verso-editor/ui-bubble-menu`)

```typescript
import { createBubbleMenuPlugin } from '@verso-editor/ui-bubble-menu'
```

Floating toolbar that appears on text selection.

### Drag Handle (`@verso-editor/ui-drag-handle`)

```typescript
import { createDragHandlePlugin } from '@verso-editor/ui-drag-handle'
```

Drag handle for block-level reordering.

### Emoji Picker (`@verso-editor/ui-emoji-picker`)

```typescript
import { EmojiPickerExtension, searchEmojis, insertEmoji } from '@verso-editor/ui-emoji-picker'
```

| Export | Description |
|--------|-------------|
| `EmojiPickerExtension` | Extension that adds `:` trigger for emoji suggestions |
| `searchEmojis(query, limit?)` | Search emoji by name or keyword |
| `insertEmoji(editor, emoji)` | Insert emoji character at cursor |

### Special Characters (`@verso-editor/ui-special-chars`)

```typescript
import { getSpecialChars, getCharCategories } from '@verso-editor/ui-special-chars'
```

| Export | Description |
|--------|-------------|
| `getSpecialChars(category?)` | Get characters, optionally filtered by category |
| `getCharCategories()` | Get available categories: math, currency, arrows, punctuation, symbols |

---

## Exporter

### PDF Export (`@verso-editor/exporter-pdf`)

```typescript
import { exportPDF, type ExportPdfOptions } from '@verso-editor/exporter-pdf'
```

#### `exportPDF(html, options?)`

Export HTML content as a PDF file.

```typescript
await exportPDF(editor.getHTML(), {
  filename: 'document.pdf',
  margin: 10,
  imageQuality: 0.98,
})
```

#### `ExportPdfOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `filename` | `string` | `'document.pdf'` | Output filename |
| `margin` | `number \| string` | `10` | Page margin (mm) |
| `imageQuality` | `number` | `0.98` | JPEG quality (0–1) |
| `html2canvas` | `Record<string, unknown>` | `{ scale: 2 }` | html2canvas options |
| `jsPDF` | `Record<string, unknown>` | `{ format: 'a4' }` | jsPDF options |

---

## Importer

### Word Import (`@verso-editor/importer-docx`)

```typescript
import { importDocx, type ImportDocxResult } from '@verso-editor/importer-docx'
```

#### `importDocx(file)`

Import a `.docx` file and convert to HTML.

```typescript
const input = document.querySelector('input[type="file"]')
input.addEventListener('change', async (e) => {
  const file = e.target.files[0]
  const { html, messages } = await importDocx(file)
  editor.setContent(html)
})
```

#### `ImportDocxResult`

| Field | Type | Description |
|-------|------|-------------|
| `html` | `string` | Converted HTML content |
| `messages` | `string[]` | Conversion warnings/messages |

---

## Templates (`@verso-editor/templates`)

```typescript
import { getTemplates, getTemplateById, getCategories, type Template } from '@verso-editor/templates'
```

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `getTemplates(category?)` | `() => Template[]` | Get all or filtered templates |
| `getTemplateById(id)` | `(id: string) => Template \| undefined` | Find template by ID |
| `getCategories()` | `() => string[]` | Get all categories |

### Built-in Templates

| ID | Name | Category |
|----|------|----------|
| `blank` | Blank Document | general |
| `report` | Report | business |
| `letter` | Formal Letter | business |
| `meeting-notes` | Meeting Notes | business |
| `blog-post` | Blog Post | content |
| `readme` | README | technical |

```typescript
const tpl = getTemplateById('report')
editor.setContent(tpl.html)
```

---

## Locales (`@verso-editor/locales`)

```typescript
import { getLocaleMessages, locales, type LocaleMessages } from '@verso-editor/locales'
```

| Export | Description |
|--------|-------------|
| `getLocaleMessages(locale)` | Get messages for a locale, falls back to English |
| `locales` | All locale dictionaries: `en`, `zh-TW`, `ja` |
| `LocaleMessages` | Type: `Record<string, string>` |

### Supported Locales

| Code | Language |
|------|----------|
| `en` | English (default) |
| `zh-TW` | 繁體中文 |
| `ja` | 日本語 |

### Usage with Core

```typescript
import { setLocale, t } from '@verso-editor/core'
import { getLocaleMessages } from '@verso-editor/locales'

setLocale('zh-TW', getLocaleMessages('zh-TW'))
t('toolbar.bold') // '粗體'
```

---

## Extension Packages

All extension packages follow a consistent API pattern:

```typescript
import { XxxExtension } from '@verso-editor/extension-xxx'
```

Each exports a frozen extension object (or multiple for compound extensions like details and footnote). Pass them directly to the `extensions` array or use via `createStarterKit()`.

### Compound Extensions

Some features ship multiple extensions:

**Details** (`@verso-editor/extension-details`):
```typescript
import { DetailsExtension, DetailsSummaryExtension, DetailsContentExtension } from '@verso-editor/extension-details'
```

**Footnote** (`@verso-editor/extension-footnote`):
```typescript
import {
  FootnoteReferenceExtension,
  FootnoteSectionExtension,
  FootnoteItemExtension,
  FootnotesPlugin,
} from '@verso-editor/extension-footnote'
```

**Task List** (`@verso-editor/extension-task-list`):
```typescript
import { TaskListExtension, TaskItemExtension } from '@verso-editor/extension-task-list'
```
