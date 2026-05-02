# @verso-editor/bubble-menu

## 1.1.0

### Minor Changes

- [`da56130`](https://github.com/cluion/verso-editor/commit/da56130a70cebd8a28fa742dae53a4c7f1be394f) Thanks [@cluion](https://github.com/cluion)! - Add i18n and theme infrastructure

  - **I18n system**: New `I18n` class with `t(key, params?)`, `registerLocale()`, `setLocale()`, `onChange()`, fallback to English
  - **Default locales**: Built-in `en` and `zh-TW` translations for all UI components
  - **Theme system**: CSS Custom Properties design tokens (`--vs-*`) with light/dark themes
  - **Theme API**: `editor.setTheme('dark', overrides?)` with `prefers-color-scheme` auto-detection and localStorage persistence
  - **Theme CSS**: Import via `@verso-editor/core/theme.css`
  - **UI packages**: bubble-menu, slash-commands, drag-handle now use i18n for aria-labels and support runtime locale switching

## 1.0.0

### Patch Changes

- Updated dependencies [[`91ddb94`](https://github.com/cluion/verso-editor/commit/91ddb94d9f4b4bff9aca6660351220491d2a67fa)]:
  - @verso-editor/core@0.2.0

## 0.1.0

### Minor Changes

- Initial 0.1.0 release with core editor, 22 extensions, framework adapters, serializers, and UI components.

### Patch Changes

- Updated dependencies
  - @verso-editor/core@0.1.0
