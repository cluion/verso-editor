# @verso-editor/extension-details

Details / Accordion extension for Verso Editor. Provides collapsible `<details>/<summary>` blocks.

## Install

```bash
pnpm add @verso-editor/extension-details
```

## Usage

```typescript
import {
  DetailsExtension,
  DetailsSummaryExtension,
  DetailsContentExtension,
  createDetailsNodeView,
} from '@verso-editor/extension-details'
```

All three nodes are included in `createStarterKit()`. The NodeView toggles the `open` attribute on click.
