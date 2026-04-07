import { createBubbleMenu } from '@verso-editor/bubble-menu'
import { Editor } from '@verso-editor/core'

const element = document.querySelector<HTMLElement>('#editor')
const bubbleEl = document.querySelector<HTMLElement>('#bubble-menu')

if (!element) {
  throw new Error('Editor element not found')
}

const editor = new Editor({
  element,
  content: '<p>Start typing...</p>',
})

// Bubble Menu
if (bubbleEl) {
  const menu = createBubbleMenu({
    editor,
    element: bubbleEl,
    items: [
      { command: 'bold', label: 'B' },
      { command: 'italic', label: 'I' },
      { command: 'code', label: 'Code' },
    ],
  })
  Object.assign(window, { menu })
}

// Expose for debugging
Object.assign(window, { editor })
