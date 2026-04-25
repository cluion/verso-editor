# @verso-editor/extension-mermaid

Mermaid diagram extension for Verso Editor. Renders [Mermaid](https://mermaid.js.org/) diagrams from code blocks.

## Features

- Detects code blocks with `language="mermaid"` and renders SVG diagrams
- Dynamic import — mermaid library is loaded on demand, not bundled
- Source/preview toggle — click to switch between SVG preview and editable source
- Loading spinner during rendering
- Error handling for invalid mermaid syntax
- Configurable via `mermaidConfig` option

## Install

```bash
pnpm add @verso-editor/extension-mermaid
```

## Usage

```typescript
import { MermaidExtension } from '@verso-editor/extension-mermaid'
import { createStarterKit } from '@verso-editor/extension-starter-kit'

// Included by default in StarterKit
const extensions = createStarterKit()

// Or with custom mermaid config
const extensions = createStarterKit({
  mermaid: MermaidExtension.configure({ mermaidConfig: { theme: 'dark' } }),
})

// Disable mermaid
const extensions = createStarterKit({ mermaid: false })
```
