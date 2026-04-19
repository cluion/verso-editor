# Extension Development

Verso Editor is built around an extension system. Everything from bold text to code blocks is an extension. This guide shows you how to create your own.

## Available Extensions

### Text Formatting

| Extension | Package | Description |
|-----------|---------|-------------|
| Bold | `@verso-editor/extension-bold` | **Bold** text (`Mod-b`) |
| Italic | `@verso-editor/extension-italic` | *Italic* text (`Mod-i`) |
| Underline | `@verso-editor/extension-underline` | Underline text (`Mod-u`) |
| Strikethrough | `@verso-editor/extension-strikethrough` | ~~Strikethrough~~ text (`Mod-Shift-s`) |
| Code | `@verso-editor/extension-code` | `Inline code` (`Mod-e`) |
| Subscript | `@verso-editor/extension-subscript` | Subscript text (`Mod-,`) |
| Superscript | `@verso-editor/extension-superscript` | Superscript text (`Mod-.`) |
| Text Color | `@verso-editor/extension-text-color` | Text color with palette |
| Highlight | `@verso-editor/extension-highlight` | Highlight text (`Mod-Shift-h`) |
| Font Family | `@verso-editor/extension-font-family` | Font family selection |
| Font Size | `@verso-editor/extension-font-size` | Font size selection |
| Text Align | `@verso-editor/extension-text-align` | Align left/center/right/justify |

### Block Elements

| Extension | Package | Description |
|-----------|---------|-------------|
| Paragraph | `@verso-editor/extension-paragraph` | Paragraph blocks |
| Heading | `@verso-editor/extension-heading` | H1–H6 headings (`Mod-Alt-1` to `Mod-Alt-6`) |
| Blockquote | `@verso-editor/extension-blockquote` | Quoted blocks (`> `) |
| Code Block | `@verso-editor/extension-code-block` | Fenced code blocks (` ``` `) |
| Horizontal Rule | `@verso-editor/extension-horizontal-rule` | Horizontal divider (`---`) |
| Hard Break | `@verso-editor/extension-hard-break` | Line break (`Shift-Enter`) |

### Lists

| Extension | Package | Description |
|-----------|---------|-------------|
| Bullet List | `@verso-editor/extension-bullet-list` | Unordered lists (`- `) |
| Ordered List | `@verso-editor/extension-ordered-list` | Numbered lists (`1. `) |
| List Item | `@verso-editor/extension-list-item` | List item with split/lift |
| Task List | `@verso-editor/extension-task-list` | Checklist with `[ ]` / `[x]` |
| Task Item | `@verso-editor/extension-task-item` | Checkbox item node |

### Links & Media

| Extension | Package | Description |
|-----------|---------|-------------|
| Link | `@verso-editor/extension-link` | Hyperlinks (`Mod-k`) |
| Image | `@verso-editor/extension-image` | Inline images |
| Image Upload | `@verso-editor/extension-image-upload` | Drag/drop image upload |
| Video | `@verso-editor/extension-video` | Embedded video (YouTube/Vimeo) |
| File Embed | `@verso-editor/extension-file-embed` | File attachment embeds |
| Autolink | `@verso-editor/extension-autolink` | Auto-detect URLs |
| Mention | `@verso-editor/extension-mention` | `@mention` suggestions |

### Table

| Extension | Package | Description |
|-----------|---------|-------------|
| Table | `@verso-editor/extension-table` | Full table support with add/delete rows/columns |

### Advanced

| Extension | Package | Description |
|-----------|---------|-------------|
| Math | `@verso-editor/extension-math` | LaTeX math via KaTeX (`$...$` / `$$...$$`) |
| Details | `@verso-editor/extension-details` | Collapsible accordion blocks |
| Footnote | `@verso-editor/extension-footnote` | Footnote references and section |
| Find & Replace | `@verso-editor/extension-find-replace` | Search with regex and highlight |
| Outline | `@verso-editor/extension-outline` | Document outline from headings |
| Print View | `@verso-editor/extension-print-view` | Print-optimized styles |
| RTL | `@verso-editor/extension-rtl` | RTL text direction (`Mod-Alt-d`) |

### Editor Behavior

| Extension | Package | Description |
|-----------|---------|-------------|
| History | `@verso-editor/extension-history` | Undo (`Mod-z`) / Redo (`Mod-Shift-z`) |
| Placeholder | `@verso-editor/extension-placeholder` | Placeholder text when empty |
| Drop Cursor | `@verso-editor/extension-drop-cursor` | Drop indicator for drag operations |
| Gap Cursor | `@verso-editor/extension-gap-cursor` | Cursor in empty blocks |
| Typography | `@verso-editor/extension-typography` | Smart quotes, dashes, ellipses |
| Character Count | `@verso-editor/extension-character-count` | Character/word counting |
| Collaboration | `@verso-editor/extension-collaboration` | Real-time collaboration via sync plugin |
| AI | `@verso-editor/extension-ai` | AI-assisted writing |

### UI Components

| Package | Description |
|---------|-------------|
| `@verso-editor/slash-commands` | Slash command menu (`/` trigger) |
| `@verso-editor/ui-bubble-menu` | Floating toolbar on selection |
| `@verso-editor/ui-drag-handle` | Drag handle for blocks |
| `@verso-editor/ui-emoji-picker` | Emoji picker (`:` trigger) |
| `@verso-editor/ui-special-chars` | Special characters panel |

### Utilities

| Package | Description |
|---------|-------------|
| `@verso-editor/exporter-pdf` | Export editor content as PDF |
| `@verso-editor/importer-docx` | Import Word (.docx) files |
| `@verso-editor/templates` | Preset document templates |
| `@verso-editor/locales` | i18n locale messages (en, zh-TW, ja) |

## Extension Types

| Type | Purpose | Class |
|------|---------|-------|
| **Extension** | General plugins, keymaps, commands | `Extension.create()` |
| **NodeExtension** | Block or inline nodes (e.g. images, code blocks) | `NodeExtension.create()` |
| **MarkExtension** | Inline formatting (e.g. bold, italic) | `MarkExtension.create()` |

## Creating a Mark Extension

Marks add inline formatting to text. Here's a `highlight` mark:

```typescript
import { MarkExtension } from '@verso-editor/core'

const highlight = MarkExtension.create({
  name: 'highlight',
  markSpec: {
    parseDOM: [{ tag: 'mark' }],
    toDOM() {
      return ['mark', 0]
    },
  },
  shortcuts: {
    'Mod-Shift-h': 'toggleHighlight',
  },
})
```

Add it to your editor:

```typescript
const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [highlight],
})
```

## Creating a Node Extension

Nodes represent blocks or inline elements. Here's a `callout` node:

```typescript
import { NodeExtension } from '@verso-editor/core'

const callout = NodeExtension.create({
  name: 'callout',
  nodeSpec: {
    content: 'inline*',
    group: 'block',
    attrs: {
      type: { default: 'info' },
    },
    parseDOM: [
      {
        tag: 'div[data-callout]',
        getAttrs(dom) {
          return { type: (dom as HTMLElement).getAttribute('data-callout') ?? 'info' }
        },
      },
    ],
    toDOM(node) {
      return ['div', { 'data-callout': node.attrs.type, class: `callout callout-${node.attrs.type}` }, 0]
    },
  },
})
```

## Extension Configuration

### Options

Extensions accept typed options with defaults:

```typescript
const colorText = MarkExtension.create({
  name: 'colorText',
  defaultOptions: {
    colors: ['red', 'blue', 'green'] as string[],
  },
  markSpec: {
    attrs: { color: { default: 'red' } },
    parseDOM: [
      {
        tag: 'span[data-color]',
        getAttrs(dom) {
          return { color: (dom as HTMLElement).getAttribute('data-color') }
        },
      },
    ],
    toDOM(mark) {
      return ['span', { 'data-color': mark.attrs.color }, 0]
    },
  },
})

// Customize at creation
const customColor = colorText.configure({ colors: ['purple', 'orange'] })
```

### Keymaps

Add keyboard shortcuts to your extension:

```typescript
const extension = Extension.create({
  name: 'customKeymap',
  keymap() {
    return {
      'Mod-Shift-b': () => {
        // Custom logic here
        return true
      },
    }
  },
})
```

### Input Rules

Input rules trigger automatic formatting as you type:

```typescript
import { wrappingInputRule } from 'prosemirror-inputrules'

const extension = Extension.create({
  name: 'customInputRules',
  inputRules() {
    return [
      // Example: typing `> ` creates a blockquote
      wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote),
    ]
  },
})
```

### Plugins

For advanced behavior, provide ProseMirror plugin factories:

```typescript
import { Plugin, PluginKey } from 'prosemirror-state'

const extension = Extension.create({
  name: 'customPlugin',
  plugins: [
    () => {
      const key = new PluginKey('customPlugin')
      return new Plugin({
        key,
        state: {
          init() {
            return null
          },
          apply(tr, value) {
            return value
          },
        },
      })
    },
  ],
})
```

## NodeView

NodeViews let you render custom DOM for a node with full control:

```typescript
const imageWithCaption = NodeExtension.create({
  name: 'imageWithCaption',
  nodeSpec: {
    inline: true,
    attrs: {
      src: { default: '' },
      alt: { default: '' },
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      { tag: 'img[src]', getAttrs(dom) { return { src: (dom as HTMLImageElement).src } } },
    ],
    toDOM(node) {
      return ['img', { src: node.attrs.src, alt: node.attrs.alt }]
    },
  },
  nodeView(node, view, getPos) {
    const dom = document.createElement('span')
    dom.classList.add('image-wrapper')
    const img = document.createElement('img')
    img.src = node.attrs.src
    img.alt = node.attrs.alt
    dom.appendChild(img)
    return { dom }
  },
})
```

## Extension Ordering

Extensions are sorted by their `dependencies` field. If your extension depends on another:

```typescript
const extension = Extension.create({
  name: 'myExtension',
  dependencies: ['bold', 'italic'],
})
```

The editor will ensure dependent extensions are loaded first.
