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
      { command: 'heading:level=1', label: 'H1' },
      { command: 'heading:level=2', label: 'H2' },
      { command: 'heading:level=3', label: 'H3' },
      { command: 'heading:level=4', label: 'H4' },
      { command: 'heading:level=5', label: 'H5' },
      { command: 'heading:level=6', label: 'H6' },
    ],
  })
  Object.assign(window, { menu })
}

// Expose for debugging
Object.assign(window, { editor })
