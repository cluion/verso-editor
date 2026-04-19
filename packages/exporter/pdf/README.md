# @verso-editor/exporter-pdf

PDF export utility for Verso Editor. Powered by [html2pdf.js](https://github.com/eKoopmans/html2pdf.js).

## Install

```bash
pnpm add @verso-editor/exporter-pdf
```

## Usage

```typescript
import { exportPDF } from '@verso-editor/exporter-pdf'

const html = editor.getHTML()
await exportPDF(html, { filename: 'document.pdf' })
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `filename` | `string` | `'document.pdf'` | Output filename |
| `margin` | `number \| string` | `10` | Page margin in mm |
| `imageQuality` | `number` | `0.98` | JPEG quality (0-1) |
| `html2canvas` | `object` | `{ scale: 2 }` | html2canvas options |
| `jsPDF` | `object` | `{ format: 'a4' }` | jsPDF options |
