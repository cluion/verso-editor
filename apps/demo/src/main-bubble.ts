import { createBubbleMenu } from '@verso-editor/bubble-menu'
import { Editor } from '@verso-editor/core'

const element = document.querySelector<HTMLElement>('#editor')

if (!element) {
  throw new Error('Editor element not found')
}

const initialContent = `
<h1>Verso Editor</h1>
<p>這是一個開源富文本編輯器，基於 ProseMirror 打造。選取下方文字試試懸浮工具列：</p>
<h2>文字格式</h2>
<p>選取文字後會跳出 <strong>懸浮工具列</strong>，可以切換粗體、斜體、行內程式碼，以及標題層級。</p>
<h2>Markdown 快捷鍵</h2>
<ul>
  <li>輸入 <code>#</code> + 空格 → H1</li>
  <li>輸入 <code>##</code> + 空格 → H2</li>
  <li>輸入 <code>###</code> + 空格 → H3</li>
  <li><code>Ctrl+B</code> 粗體 / <code>Ctrl+I</code> 斜體</li>
  <li><code>&gt;</code> + 空格 → 引用區塊</li>
  <li><code>---</code> → 分隔線</li>
</ul>
<blockquote>這是一段引用文字，用來展示引用區塊的樣式。</blockquote>
<h3>開始編輯</h3>
<p>直接在這裡打字、刪除、格式化，體驗編輯器的各項功能。</p>
`.trim()

const editor = new Editor({
  element,
  content: initialContent,
})

// --- Bubble Menu ---

const bubbleEl = document.createElement('div')
bubbleEl.id = 'bubble-menu'

createBubbleMenu({
  editor,
  element: bubbleEl,
  items: [
    { command: 'bold', label: 'B' },
    { command: 'italic', label: 'I' },
    { command: 'code', label: '</>' },
    { command: 'heading:level=1', label: 'H1' },
    { command: 'heading:level=2', label: 'H2' },
    { command: 'heading:level=3', label: 'H3' },
    { command: 'heading:level=4', label: 'H4' },
    { command: 'heading:level=5', label: 'H5' },
    { command: 'heading:level=6', label: 'H6' },
  ],
})

Object.assign(window, { editor })
