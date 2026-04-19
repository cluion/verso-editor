# @verso-editor/extension-outline

Document Outline extension for Verso Editor. Monitors heading nodes and provides an `onUpdate` callback with the outline structure.

## Install

```bash
pnpm add @verso-editor/extension-outline
```

## Usage

```typescript
import { OutlineExtension } from '@verso-editor/extension-outline'

const ext = OutlineExtension.configure({
  onUpdate: (outline) => {
    console.log(outline) // [{ level: 1, text: 'Title', pos: 0, id: 'heading-0' }, ...]
  },
})
```

Included in `createStarterKit()`.
