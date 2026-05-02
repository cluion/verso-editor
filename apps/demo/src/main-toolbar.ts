import { Editor } from '@verso-editor/core'
import '@verso-editor/core/theme.css'
import { goToBookmark } from '@verso-editor/extension-bookmark'
import { toLowerCase, toTitleCase, toUpperCase } from '@verso-editor/extension-case-change'
import { addComment, removeComment } from '@verso-editor/extension-comment'
import { toggleFullscreen } from '@verso-editor/extension-fullscreen'
import { createStarterKit } from '@verso-editor/extension-starter-kit'
import { acceptChanges, rejectChanges } from '@verso-editor/extension-track-changes'
import { ContextMenu } from '@verso-editor/ui-context-menu'
import { setBlockType, toggleMark } from 'prosemirror-commands'

const element = document.querySelector<HTMLElement>('#editor')
const toolbarEl = document.querySelector<HTMLElement>('#toolbar')

if (!element) {
  throw new Error('Editor element not found')
}

const initialContent = `
<h1>Verso Editor</h1>
<p>這是一個開源富文本編輯器，基於 ProseMirror 打造。試試以下功能：</p>
<h2>文字格式</h2>
<p>使用上方固定工具列的按鈕切換格式：</p>
<ul>
  <li><strong>粗體</strong>、<em>斜體</em>、<code>行內程式碼</code></li>
  <li>H1 ~ H6 標題切換</li>
</ul>
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
<h3>Phase C-4 企業級功能</h3>
<p>追蹤修訂、評論、版本歷史、格式複製、大小寫轉換、書籤等功能已在工具列中可用。</p>
<h3>開始編輯</h3>
<p>直接在這裡打字、刪除、格式化，體驗編輯器的各項功能。</p>
`.trim()

const editor = new Editor({
  element,
  content: initialContent,
  extensions: createStarterKit(),
  i18n: { locale: 'zh-TW' },
  theme: { persistTheme: true },
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

  const mark = state.schema.marks[cmd]
  if (mark) {
    toggleMark(mark)(state, dispatch)
    return
  }

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

  const c4Items = [
    { label: '✔ Accept', action: () => acceptChanges(editor.view.state, editor.view.dispatch) },
    { label: '✘ Reject', action: () => rejectChanges(editor.view.state, editor.view.dispatch) },
    {
      label: 'Comment',
      action: () => {
        const id = `cmt-${Date.now()}`
        const threadId = `thread-${Date.now()}`
        addComment(id, threadId)(editor.view.state, editor.view.dispatch)
      },
    },
    {
      label: 'Rm Comment',
      action: () => {
        const threadId = prompt('Enter threadId to remove:')
        if (threadId) removeComment(threadId)(editor.view.state, editor.view.dispatch)
      },
    },
    { label: 'UPPER', action: () => toUpperCase()(editor.view.state, editor.view.dispatch) },
    { label: 'lower', action: () => toLowerCase()(editor.view.state, editor.view.dispatch) },
    { label: 'Title', action: () => toTitleCase()(editor.view.state, editor.view.dispatch) },
    {
      label: 'Bookmark',
      action: () => {
        const name = prompt('Bookmark name:') ?? 'bm1'
        const { state, dispatch } = editor.view
        const bmType = state.schema.nodes.bookmark
        if (bmType) {
          const node = bmType.create({ id: `bm-${Date.now()}`, name })
          dispatch(state.tr.replaceSelectionWith(node))
        }
      },
    },
    {
      label: 'Go BM',
      action: () => {
        const id = prompt('Bookmark id (e.g. bm-...):')
        if (id) goToBookmark(id)(editor.view.state, editor.view.dispatch)
      },
    },
    {
      label: 'Snapshot',
      action: () => {
        const snap = editor.createSnapshot()
        const history = editor.getRevisionHistory()
        alert(`Snapshot created: ${snap.id}\nTotal snapshots: ${history.length}`)
      },
    },
    {
      label: 'Restore',
      action: () => {
        const history = editor.getRevisionHistory()
        if (history.length === 0) {
          alert('No snapshots yet')
          return
        }
        const list = history
          .map((s, i) => `${i}: ${s.id} (${new Date(s.timestamp).toLocaleTimeString()})`)
          .join('\n')
        const idx = Number(prompt(`Snapshots:\n${list}\n\nEnter index to restore:`))
        if (!Number.isNaN(idx) && history[idx]) {
          editor.restoreRevision(history[idx])
        }
      },
    },
    {
      label: 'Fullscreen',
      action: () => toggleFullscreen()(editor.view.state, editor.view.dispatch),
    },
    {
      label: 'Paginated',
      action: () => {
        const { state, dispatch } = editor.view
        const tr = state.tr.setMeta('pagination', { mode: 'paginated' })
        dispatch(tr)
      },
    },
    {
      label: 'Continuous',
      action: () => {
        const { state, dispatch } = editor.view
        const tr = state.tr.setMeta('pagination', { mode: 'continuous' })
        dispatch(tr)
      },
    },
  ]

  toolbarEl.setAttribute('role', 'toolbar')
  toolbarEl.setAttribute('aria-label', 'Formatting toolbar')

  // Basic formatting buttons
  for (const item of toolbarItems) {
    const button = document.createElement('button')
    button.textContent = item.label
    button.setAttribute('data-command', item.command)
    button.addEventListener('click', () => executeCommand(item.command))
    toolbarEl.appendChild(button)
  }

  // Separator
  const sep = document.createElement('span')
  sep.className = 'toolbar-sep'
  toolbarEl.appendChild(sep)

  // C-4 feature buttons
  for (const item of c4Items) {
    const button = document.createElement('button')
    button.textContent = item.label
    button.className = 'c4-btn'
    button.addEventListener('click', item.action)
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

// --- Context Menu ---

const contextMenu = new ContextMenu({ items: [] })

element.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  const { state, dispatch } = editor.view
  contextMenu.show(e.clientX, e.clientY, [
    { label: 'Bold', command: () => toggleMark(state.schema.marks.bold)(state, dispatch) },
    { label: 'Italic', command: () => toggleMark(state.schema.marks.italic)(state, dispatch) },
    { label: 'Separator', command: () => {}, separator: true },
    { label: 'UPPERCASE', command: () => toUpperCase()(state, dispatch) },
    { label: 'lowercase', command: () => toLowerCase()(state, dispatch) },
    { label: 'Title Case', command: () => toTitleCase()(state, dispatch) },
    { label: 'Separator', command: () => {}, separator: true },
    {
      label: 'Add Comment',
      command: () => {
        const id = `cmt-${Date.now()}`
        addComment(id, `thread-${Date.now()}`)(state, dispatch)
      },
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
  ])
})

// --- Preview Panels ---

const previewHtmlEl = document.querySelector<HTMLElement>('#panel-html code')
const previewJsonEl = document.querySelector<HTMLElement>('#panel-json code')

function updatePreview(): void {
  if (previewHtmlEl) {
    previewHtmlEl.textContent = editor.getHTML()
  }
  if (previewJsonEl) {
    previewJsonEl.textContent = JSON.stringify(editor.getJSON(), null, 2)
  }
}

editor.on('update', updatePreview)
updatePreview()

// --- Preview Tab Switching ---

const tabButtons = document.querySelectorAll<HTMLButtonElement>('.preview-tab')
for (const btn of tabButtons) {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab
    for (const b of tabButtons) {
      b.classList.toggle('active', b.dataset.tab === tab)
    }
    for (const panel of document.querySelectorAll('.preview-panel-wrapper')) {
      panel.classList.toggle('active', panel.id === `panel-${tab}`)
    }
  })
}

// --- Copy Buttons ---

for (const btn of document.querySelectorAll<HTMLButtonElement>('.copy-btn')) {
  btn.addEventListener('click', async () => {
    const target = btn.dataset.target
    const content = target === 'html' ? editor.getHTML() : JSON.stringify(editor.getJSON(), null, 2)
    await navigator.clipboard.writeText(content)
    btn.textContent = 'Copied!'
    setTimeout(() => {
      btn.textContent = 'Copy'
    }, 1500)
  })
}

Object.assign(window, { editor })

// --- Locale & Theme Controls ---

const localeSelect = document.querySelector<HTMLSelectElement>('#locale-select')
if (localeSelect) {
  localeSelect.value = editor.i18n.getLocale()
  localeSelect.addEventListener('change', () => {
    editor.i18n.setLocale(localeSelect.value)
    updateLocaleStatus()
  })
}

function updateLocaleStatus() {
  const el = document.querySelector<HTMLElement>('#locale-status')
  if (el) el.textContent = editor.i18n.t('editor.ariaLabel')
}

const themeSelect = document.querySelector<HTMLSelectElement>('#theme-select')
if (themeSelect) {
  themeSelect.value = editor.getTheme()
  themeSelect.addEventListener('change', () => {
    editor.setTheme(themeSelect.value)
  })
}
