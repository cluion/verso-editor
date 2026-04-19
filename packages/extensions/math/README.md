# @verso-editor/extension-math

Math / LaTeX extension for Verso Editor. Renders formulas using [KaTeX](https://katex.org/).

## Features

- Inline math (`$...$`) and block math (`$$...$$`) via InputRules
- KaTeX rendering in a custom NodeView
- Click-to-edit LaTeX source

## Install

```bash
pnpm add @verso-editor/extension-math
```

## Usage

```typescript
import { MathExtension, createMathNodeView } from '@verso-editor/extension-math'
```

The extension is included in `createStarterKit()`. Type `$E=mc^2$` for inline math or `$$\frac{a}{b}$$` for block math.
