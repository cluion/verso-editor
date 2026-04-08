import { Extension } from '@verso-editor/core'

export const PlaceholderExtension = Extension.create({
  name: 'placeholder',
  defaultOptions: {
    placeholder: 'Start typing...',
  },
})
