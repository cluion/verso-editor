import { createBubbleMenu } from '@verso-editor/bubble-menu'
import { Editor } from '@verso-editor/core'
import { setBlockType, toggleMark } from 'prosemirror-commands'

const element = document.querySelector<HTMLElement>('#editor')
const toolbarEl = document.querySelector<HTMLElement>('#toolbar')
const bubbleEl = document.querySelector<HTMLElement>('#bubble-menu')

if (!element) {
  throw new Error('Editor element not found')
}

const initialContent = `
<h1>Verso Editor</h1>
<p>這是一個開源富文本編輯器，基於 ProseMirror 打造。試試以下功能：</p>
<h2>文字格式</h2>
<p>選取文字後會跳出 <strong>懸浮工具列</strong>，可以切換粗體、斜體、行內程式碼。</p>
<h2>標題切換</h2>
<p>使用上方固定工具列的 H1~H6 按鈕切換標題層級，也可以用 Markdown 快捷鍵：</p>
<ul>
  <li>輸入 <code>#</code> + 空格 → H1</li>
  <li>輸入 <code>##</code> + 空格 → H2</li>
  <li>輸入 <code>###</code> + 空格 → H3</li>
</ul>
<h3>其他快捷鍵</h3>
<ul>
  <li><code>Ctrl+B</code> 粗體</li>
  <li><code>Ctrl+I</code> 斜體</li>
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

// --- Helpers ---

function parseCommand(cmd: string): { nodeName: string; attrs?: Record<string, unknown> } {
  const colonIdx = cmd.indexOf(':')
  if (colonIdx === -1) return { nodeName: cmd }
  const nodeName = cmd.slice(0, colonIdx)
  const attrs: Record<string, unknown> = {}
  for (const pair of cmd.slice(colonIdx + 1).split(',')) {
    const eqIdx = pair.indexOf('=')
    if (eqIdx !== -1) {
      const key = pair.slice(0, eqIdx)
      const rawVal = pair.slice(eqIdx + 1)
      const numVal = Number(rawVal)
      attrs[key] = Number.isNaN(numVal) ? rawVal : numVal
    }
  }
  return { nodeName, attrs }
}

function isNodeActive(
  state: typeof editor.view.state,
  nodeName: string,
  attrs?: Record<string, unknown>,
): boolean {
  const nodeType = state.schema.nodes[nodeName]
  if (!nodeType) return false
  const { $from } = state.selection
  for (let d = $from.depth; d > 0; d--) {
    const node = $from.node(d)
    if (node.type === nodeType) {
      if (!attrs) return true
      return Object.entries(attrs).every(([k, v]) => node.attrs[k] === v)
    }
  }
  if ($from.parent.type === nodeType) {
    if (!attrs) return true
    return Object.entries(attrs).every(([k, v]) => $from.parent.attrs[k] === v)
  }
  return false
}

function executeCommand(cmd: string): void {
  const { state, dispatch } = editor.view

  // Try mark toggle
  const mark = state.schema.marks[cmd]
  if (mark) {
    toggleMark(mark)(state, dispatch)
    return
  }

  // Try node type toggle
  const { nodeName, attrs } = parseCommand(cmd)
  const nodeType = state.schema.nodes[nodeName]
  if (nodeType) {
    if (isNodeActive(state, nodeName, attrs)) {
      const paragraph = state.schema.nodes.paragraph
      if (paragraph) setBlockType(paragraph)(state, dispatch)
    } else {
      setBlockType(nodeType, attrs)(state, dispatch)
    }
  }
}

// --- Fixed Toolbar ---

if (toolbarEl) {
  const toolbarItems = [
    { command: 'bold', label: 'B' },
    { command: 'italic', label: 'I' },
    { command: 'code', label: '</>' },
    { command: 'heading:level=1', label: 'H1' },
    { command: 'heading:level=2', label: 'H2' },
    { command: 'heading:level=3', label: 'H3' },
    { command: 'heading:level=4', label: 'H4' },
    { command: 'heading:level=5', label: 'H5' },
    { command: 'heading:level=6', label: 'H6' },
  ]

  toolbarEl.setAttribute('role', 'toolbar')
  toolbarEl.setAttribute('aria-label', 'Formatting toolbar')

  for (const item of toolbarItems) {
    const button = document.createElement('button')
    button.textContent = item.label
    button.setAttribute('data-command', item.command)
    button.addEventListener('click', () => executeCommand(item.command))
    toolbarEl.appendChild(button)
  }

  function updateToolbar(): void {
    const { state } = editor.view
    const buttons = toolbarEl.querySelectorAll('button[data-command]')
    for (const button of buttons) {
      const cmd = button.getAttribute('data-command') ?? ''

      const mark = state.schema.marks[cmd]
      if (mark) {
        const { from, $from, to, empty } = state.selection
        const active = empty
          ? mark.isInSet(state.storedMarks ?? $from.marks()) !== undefined
          : state.doc.rangeHasMark(from, to, mark)
        button.classList.toggle('active', active)
        continue
      }

      const { nodeName, attrs } = parseCommand(cmd)
      const active = isNodeActive(state, nodeName, attrs)
      button.classList.toggle('active', active)
    }
  }

  editor.on('update', updateToolbar)
  updateToolbar()
}

// --- Bubble Menu (appears on text selection) ---

if (bubbleEl) {
  createBubbleMenu({
    editor,
    element: bubbleEl,
    items: [
      { command: 'bold', label: 'B' },
      { command: 'italic', label: 'I' },
      { command: 'code', label: '</>' },
    ],
  })
}

Object.assign(window, { editor })
