import { createBubbleMenu } from '@verso-editor/bubble-menu'
import { Editor } from '@verso-editor/core'
import { toLowerCase, toTitleCase, toUpperCase } from '@verso-editor/extension-case-change'
import { addComment } from '@verso-editor/extension-comment'
import { toggleFullscreen } from '@verso-editor/extension-fullscreen'
import { createStarterKit } from '@verso-editor/extension-starter-kit'
import { acceptChanges, rejectChanges } from '@verso-editor/extension-track-changes'
import { ContextMenu } from '@verso-editor/ui-context-menu'
import { toggleMark } from 'prosemirror-commands'

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
<h2>Phase C-4 企業級功能</h2>
<p>選取文字後，懸浮工具列右側有 Accept / Reject / Comment / UPPER / lower / Title 等按鈕。也可按 Ctrl+Shift+C 複製格式、Ctrl+Shift+V 貼上格式。右鍵可開啟選單。</p>
<h3>開始編輯</h3>
<p>直接在這裡打字、刪除、格式化，體驗編輯器的各項功能。</p>
`.trim()

const editor = new Editor({
  element,
  content: initialContent,
  extensions: createStarterKit(),
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
  ],
})

// Add C-4 feature buttons to bubble menu
const c4BubbleItems = [
  {
    label: '✔',
    title: 'Accept Changes',
    action: () => acceptChanges(editor.view.state, editor.view.dispatch),
  },
  {
    label: '✘',
    title: 'Reject Changes',
    action: () => rejectChanges(editor.view.state, editor.view.dispatch),
  },
  {
    label: '💬',
    title: 'Add Comment',
    action: () => {
      const id = `cmt-${Date.now()}`
      addComment(id, `thread-${Date.now()}`)(editor.view.state, editor.view.dispatch)
    },
  },
  {
    label: 'AA',
    title: 'UPPERCASE',
    action: () => toUpperCase()(editor.view.state, editor.view.dispatch),
  },
  {
    label: 'aa',
    title: 'lowercase',
    action: () => toLowerCase()(editor.view.state, editor.view.dispatch),
  },
  {
    label: 'Aa',
    title: 'Title Case',
    action: () => toTitleCase()(editor.view.state, editor.view.dispatch),
  },
]

const sep = document.createElement('span')
sep.className = 'bubble-sep'
bubbleEl.appendChild(sep)

for (const item of c4BubbleItems) {
  const btn = document.createElement('button')
  btn.textContent = item.label
  btn.title = item.title
  btn.addEventListener('mousedown', (e) => e.preventDefault())
  btn.addEventListener('click', () => item.action())
  bubbleEl.appendChild(btn)
}

// --- Context Menu ---

const contextMenu = new ContextMenu({ items: [] })

element.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  const { state, dispatch } = editor.view
  contextMenu.show(e.clientX, e.clientY, [
    {
      label: 'Bold',
      command: () => {
        const m = state.schema.marks.bold
        if (m) toggleMark(m)(state, dispatch)
      },
    },
    {
      label: 'Italic',
      command: () => {
        const m = state.schema.marks.italic
        if (m) toggleMark(m)(state, dispatch)
      },
    },
    { label: 'Separator', command: () => {}, separator: true },
    { label: 'UPPERCASE', command: () => toUpperCase()(state, dispatch) },
    { label: 'lowercase', command: () => toLowerCase()(state, dispatch) },
    { label: 'Title Case', command: () => toTitleCase()(state, dispatch) },
    { label: 'Separator', command: () => {}, separator: true },
    {
      label: 'Add Comment',
      command: () => addComment(`cmt-${Date.now()}`, `thread-${Date.now()}`)(state, dispatch),
    },
    {
      label: 'Insert Bookmark',
      command: () => {
        const name = prompt('Bookmark name:') ?? 'bm1'
        const bmType = state.schema.nodes.bookmark
        if (bmType)
          dispatch(state.tr.replaceSelectionWith(bmType.create({ id: `bm-${Date.now()}`, name })))
      },
    },
    { label: 'Separator', command: () => {}, separator: true },
    { label: 'Accept Changes', command: () => acceptChanges(state, dispatch) },
    { label: 'Reject Changes', command: () => rejectChanges(state, dispatch) },
    { label: 'Separator', command: () => {}, separator: true },
    {
      label: 'Snapshot',
      command: () => {
        const snap = editor.createSnapshot()
        alert(`Snapshot: ${snap.id}\nTotal: ${editor.getRevisionHistory().length}`)
      },
    },
    { label: 'Fullscreen', command: () => toggleFullscreen()(state, dispatch) },
  ])
})

Object.assign(window, { editor })
