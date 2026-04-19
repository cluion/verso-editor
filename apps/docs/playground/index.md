<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const editorContainer = ref(null)
const output = ref('')
const outputType = ref('json')
let editor = null

onMounted(async () => {
  // Dynamically import to avoid SSR issues
  const { Editor } = await import('@verso-editor/core')
  const { createStarterKit } = await import('@verso-editor/extension-starter-kit')

  if (editorContainer.value) {
    editor = new Editor({
      element: editorContainer.value,
      content: '<h2>Welcome to Verso Editor</h2><p>Start typing to see it in action.</p><ul><li>Use <strong>bold</strong> and <em>italic</em> formatting</li><li>Try keyboard shortcuts: Mod+B, Mod+I, Mod+Z</li></ul>',
      extensions: createStarterKit(),
    })

    editor.on('update', () => {
      updateOutput()
    })

    updateOutput()
  }
})

function updateOutput() {
  if (!editor) return
  if (outputType.value === 'json') {
    output.value = JSON.stringify(editor.getJSON(), null, 2)
  } else {
    output.value = editor.getHTML()
  }
}

function switchOutput(type) {
  outputType.value = type
  updateOutput()
}

onBeforeUnmount(() => {
  editor?.destroy()
})
</script>

# Playground

Try Verso Editor live. Edit the content below and see the output update in real-time.

<div ref="editorContainer" class="playground-editor"></div>

<div class="playground-controls">
  <button :class="{ active: outputType === 'json' }" @click="switchOutput('json')">JSON</button>
  <button :class="{ active: outputType === 'html' }" @click="switchOutput('html')">HTML</button>
</div>

<pre class="playground-output"><code>{{ output }}</code></pre>

<style scoped>
.playground-editor {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
  margin-bottom: 16px;
}

.playground-editor :deep(.ProseMirror) {
  outline: none;
  min-height: 160px;
  font-family: var(--vp-font-family-base);
}

.playground-editor :deep(h2) {
  margin-top: 0;
}

.playground-controls {
  margin-bottom: 8px;
}

.playground-controls button {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  margin-right: 4px;
  font-size: 13px;
}

.playground-controls button.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.playground-output {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
}
</style>
