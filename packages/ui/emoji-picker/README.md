# @verso-editor/ui-emoji-picker

Emoji picker UI extension for Verso Editor. Provides a suggestion plugin triggered by typing `:`.

## Features

- Suggestion plugin triggered by `:` character
- Built-in emoji list with keyword search
- `onOpen` / `onClose` callbacks for custom UI

## Install

```bash
pnpm add @verso-editor/ui-emoji-picker
```

## Usage

```typescript
import {
  EmojiPickerExtension,
  searchEmojis,
  insertEmoji,
} from '@verso-editor/ui-emoji-picker'

const ext = EmojiPickerExtension.configure({
  onOpen: ({ range, query }) => {
    const results = searchEmojis(query)
    // Render your UI, then call insertEmoji(view, range, emoji)
  },
  onClose: () => { /* hide picker */ },
})
```
