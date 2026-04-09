# Extension Development

Verso Editor is built around an extension system. Everything from bold text to code blocks is an extension. This guide shows you how to create your own.

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
