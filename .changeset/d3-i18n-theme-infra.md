---
'@verso-editor/core': minor
'@verso-editor/bubble-menu': minor
'@verso-editor/slash-commands': minor
'@verso-editor/drag-handle': minor
---

Add i18n and theme infrastructure

- **I18n system**: New `I18n` class with `t(key, params?)`, `registerLocale()`, `setLocale()`, `onChange()`, fallback to English
- **Default locales**: Built-in `en` and `zh-TW` translations for all UI components
- **Theme system**: CSS Custom Properties design tokens (`--vs-*`) with light/dark themes
- **Theme API**: `editor.setTheme('dark', overrides?)` with `prefers-color-scheme` auto-detection and localStorage persistence
- **Theme CSS**: Import via `@verso-editor/core/theme.css`
- **UI packages**: bubble-menu, slash-commands, drag-handle now use i18n for aria-labels and support runtime locale switching
