# @verso-editor/ui-special-chars

Special characters panel for Verso Editor. Provides categorized lists of math, currency, arrows, punctuation, and symbol characters.

## Install

```bash
pnpm add @verso-editor/ui-special-chars
```

## Usage

```typescript
import { getSpecialChars, getCharCategories } from '@verso-editor/ui-special-chars'

// Get all characters
getSpecialChars()

// Filter by category
getSpecialChars('math') // ±, ×, ÷, ≠, ≤, ≥, ∞, ...

// List categories
getCharCategories() // ['math', 'currency', 'arrows', 'punctuation', 'symbols']
```

## Categories

| Category | Examples |
|----------|----------|
| `math` | ± × ÷ ≠ ≤ ≥ ∞ ∑ ∏ √ ∫ |
| `currency` | $ € £ ¥ ₩ ₹ ¢ |
| `arrows` | → ← ↑ ↓ ↔ ⇒ ⇐ |
| `punctuation` | … – — « » 「 」 |
| `symbols` | © ® ™ § ¶ † ‡ ° ‰ № |
