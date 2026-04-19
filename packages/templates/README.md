# @verso-editor/templates

Preset document templates for Verso Editor.

## Install

```bash
pnpm add @verso-editor/templates
```

## Usage

```typescript
import { getTemplates, getTemplateById, getCategories } from '@verso-editor/templates'

// Get all templates
getTemplates() // [{ id: 'blank', name: 'Blank Document', category: 'general', html: '<p></p>' }, ...]

// Filter by category
getTemplates('business') // report, letter, meeting-notes

// Get a specific template
const tpl = getTemplateById('report')
editor.setContent(tpl.html)
```

## Available Templates

| ID | Name | Category |
|----|------|----------|
| `blank` | Blank Document | general |
| `report` | Report | business |
| `letter` | Formal Letter | business |
| `meeting-notes` | Meeting Notes | business |
| `blog-post` | Blog Post | content |
| `readme` | README | technical |
