# @verso-editor/locales

Locale files for Verso Editor i18n system. Provides translations for en, zh-TW, and ja.

## Install

```bash
pnpm add @verso-editor/locales
```

## Usage

```typescript
import { setLocale } from '@verso-editor/core'
import { getLocaleMessages } from '@verso-editor/locales'

setLocale('zh-TW', getLocaleMessages('zh-TW'))
```

## Supported Locales

| Locale | Language |
|--------|----------|
| `en` | English (default) |
| `zh-TW` | 繁體中文 |
| `ja` | 日本語 |
