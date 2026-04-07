import { Editor } from '@verso-editor/core'

const element = document.querySelector<HTMLElement>('#editor')

if (!element) {
  throw new Error('Editor element not found')
}

const editor = new Editor({
  element,
  content: '<p>Start typing...</p>',
})

// Expose for debugging
Object.assign(window, { editor })
