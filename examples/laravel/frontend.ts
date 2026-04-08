/**
 * Frontend integration example for verso-editor with a Laravel backend.
 *
 * This file demonstrates:
 * 1. Loading JSON content from the Laravel API
 * 2. Initializing the editor with the loaded content
 * 3. Auto-saving changes back to the API
 * 4. Converting to HTML for server-side rendering
 */
import { Editor } from '@verso-editor/core'
import { toHTML } from '@verso-editor/serializer-html'
import { fromJSON } from '@verso-editor/serializer-json'

const API_BASE = '/api/posts'

// --- Fetch post from Laravel API ---

interface Post {
  id: number
  title: string
  content: Record<string, unknown> | null
  content_html: string | null
}

async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(`${API_BASE}/${id}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch post: ${res.status}`)
  }
  return res.json() as Promise<Post>
}

// --- Save post to Laravel API ---

async function savePost(id: number, data: Partial<Post>): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Failed to save post: ${res.status}`)
  }
}

// --- Initialize editor ---

async function initEditor(postId: number): Promise<Editor> {
  const post = await fetchPost(postId)

  // Convert stored JSON to HTML for initial content
  const initialContent = post.content
    ? (() => {
        const doc = fromJSON(editorSchema, post.content as Parameters<typeof fromJSON>[1])
        return toHTML(doc, editorSchema)
      })()
    : '<p></p>'

  const element = document.querySelector<HTMLElement>('#editor')
  if (!element) {
    throw new Error('Editor element not found')
  }

  const editor = new Editor({
    element,
    content: initialContent,
  })

  // Auto-save with debounce on content change
  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  editor.on('update', (json) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    saveTimeout = setTimeout(() => {
      savePost(postId, {
        content: json,
        content_html: editor.getHTML(),
      }).catch((err) => {
        console.error('Auto-save failed:', err)
      })
    }, 1000)
  })

  return editor
}

// Placeholder — in production, use the schema built from your extensions
import type { Schema } from 'prosemirror-model'
declare const editorSchema: Schema

// --- Bootstrap ---

const POST_ID = 1
initEditor(POST_ID)
  .then((editor) => {
    Object.assign(window, { editor })
  })
  .catch((err) => {
    console.error('Editor init failed:', err)
  })
