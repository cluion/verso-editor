# @verso-editor/importer-docx

Word (.docx) import utility for Verso Editor. Powered by [mammoth.js](https://github.com/mwilliamson/mammoth.js).

## Install

```bash
pnpm add @verso-editor/importer-docx
```

## Usage

```typescript
import { importDocx } from '@verso-editor/importer-docx'

const input = document.querySelector<HTMLInputElement>('input[type="file"]')!
const file = input.files![0]
const { html } = await importDocx(file)
editor.setContent(html)
```
