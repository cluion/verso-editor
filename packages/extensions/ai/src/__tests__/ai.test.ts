import { Schema } from 'prosemirror-model'
import { EditorState, Plugin, TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { type AIConfig, type AIStreamChunk, createAIPlugin } from '../index'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['p', 0] as unknown as HTMLElement,
    },
    text: { group: 'inline' },
  },
})

let views: EditorView[] = []

afterEach(() => {
  for (const v of views) {
    v.destroy()
  }
  views = []
  vi.restoreAllMocks()
})

function createView(plugins: Plugin[] = [], content = 'Hello world'): EditorView {
  const element = document.createElement('div')
  document.body.appendChild(element)
  const doc = schema.nodes.doc.create(
    null,
    schema.nodes.paragraph.create(null, schema.text(content)),
  )
  const view = new EditorView(element, {
    state: EditorState.create({ doc, plugins, selection: TextSelection.atStart(doc) }),
    dispatchTransaction(tr) {
      const newState = view.state.apply(tr)
      view.updateState(newState)
    },
  })
  views.push(view)
  return view
}

describe('AI Integration', () => {
  describe('AIConfig Interface', () => {
    it('creates plugin with AIConfig providing complete function', () => {
      const aiConfig: AIConfig = {
        complete: vi.fn().mockResolvedValue('AI response'),
      }
      const plugin = createAIPlugin({ ai: aiConfig })
      expect(plugin).toBeInstanceOf(Plugin)
    })

    it('creates plugin with AIConfig providing stream function', () => {
      async function* streamGen(): AsyncGenerator<AIStreamChunk> {
        yield { text: 'Hello' }
        yield { text: ' world' }
        yield { done: true }
      }
      const aiConfig: AIConfig = {
        stream: vi.fn().mockReturnValue(streamGen()),
      }
      const plugin = createAIPlugin({ ai: aiConfig })
      expect(plugin).toBeInstanceOf(Plugin)
    })
  })

  describe('Rewrite Command', () => {
    it('calls AI complete and replaces selected text', async () => {
      const complete = vi.fn().mockResolvedValue('Rewritten text')
      const aiConfig: AIConfig = { complete }
      const plugin = createAIPlugin({ ai: aiConfig })
      const view = createView([plugin], 'Original text')

      // Select "Original"
      const from = 1
      const to = 9
      const sel = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to))
      view.dispatch(sel)

      // Get commands from plugin state
      const state = plugin.getState(view.state) as { rewrite: () => Promise<void> }
      expect(state.rewrite).toBeDefined()
      await state.rewrite()

      expect(complete).toHaveBeenCalledWith('Original', expect.any(Object))

      // The selected text should be replaced
      let text = ''
      view.state.doc.descendants((node) => {
        if (node.isText) text += node.text
      })
      expect(text).toContain('Rewritten text')
      expect(text).not.toContain('Original')
    })
  })

  describe('Translate Command', () => {
    it('calls AI complete with translate instruction', async () => {
      const complete = vi.fn().mockResolvedValue('Hola mundo')
      const aiConfig: AIConfig = { complete }
      const plugin = createAIPlugin({ ai: aiConfig })
      const view = createView([plugin], 'Hello world')

      // Select all
      const sel = view.state.tr.setSelection(
        TextSelection.create(view.state.doc, 1, view.state.doc.content.size - 1),
      )
      view.dispatch(sel)

      const state = plugin.getState(view.state) as { translate: (lang: string) => Promise<void> }
      await state.translate('Spanish')

      expect(complete).toHaveBeenCalledWith(
        'Hello world',
        expect.objectContaining({ instruction: expect.stringContaining('Spanish') }),
      )

      let text = ''
      view.state.doc.descendants((node) => {
        if (node.isText) text += node.text
      })
      expect(text).toContain('Hola mundo')
    })
  })

  describe('Summarize Command', () => {
    it('calls AI complete and inserts summary after selection', async () => {
      const complete = vi.fn().mockResolvedValue('Summary of text')
      const aiConfig: AIConfig = { complete }
      const plugin = createAIPlugin({ ai: aiConfig })
      const view = createView([plugin], 'Long text here')

      // Select all
      const sel = view.state.tr.setSelection(
        TextSelection.create(view.state.doc, 1, view.state.doc.content.size - 1),
      )
      view.dispatch(sel)

      const state = plugin.getState(view.state) as { summarize: () => Promise<void> }
      await state.summarize()

      expect(complete).toHaveBeenCalledWith('Long text here', expect.any(Object))
      const callArgs = complete.mock.calls[0] as [string, { instruction: string }]
      expect(callArgs[1].instruction.toLowerCase()).toContain('summar')
    })
  })

  describe('Stream Autocomplete', () => {
    it('accumulates stream chunks and applies as decoration suggestion', async () => {
      const chunks: AIStreamChunk[] = [{ text: 'Hel' }, { text: 'lo' }, { done: true }]
      async function* streamGen(): AsyncGenerator<AIStreamChunk> {
        for (const chunk of chunks) {
          yield chunk
        }
      }
      const stream = vi.fn().mockReturnValue(streamGen())
      const aiConfig: AIConfig = { stream }
      const plugin = createAIPlugin({ ai: aiConfig })
      const view = createView([plugin], 'Go')

      // Move cursor to end
      const endPos = view.state.doc.content.size - 1
      const sel = view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(endPos)))
      view.dispatch(sel)

      const state = plugin.getState(view.state) as { autocomplete: () => Promise<string> }
      const result = await state.autocomplete()

      expect(stream).toHaveBeenCalled()
      expect(result).toBe('Hello')
    })
  })

  describe('Error Handling', () => {
    it('handles AI complete rejection gracefully', async () => {
      const complete = vi.fn().mockRejectedValue(new Error('API error'))
      const aiConfig: AIConfig = { complete }
      const onError = vi.fn()
      const plugin = createAIPlugin({ ai: aiConfig, onError })
      const view = createView([plugin], 'Hello')

      const sel = view.state.tr.setSelection(TextSelection.create(view.state.doc, 1, 6))
      view.dispatch(sel)

      const state = plugin.getState(view.state) as { rewrite: () => Promise<void> }
      await state.rewrite()

      expect(onError).toHaveBeenCalledWith(expect.any(Error))
    })

    it('does nothing when no text is selected for rewrite', async () => {
      const complete = vi.fn().mockResolvedValue('Rewritten')
      const aiConfig: AIConfig = { complete }
      const plugin = createAIPlugin({ ai: aiConfig })
      const view = createView([plugin], 'Hello world')

      // Cursor is collapsed (no selection)
      const state = plugin.getState(view.state) as { rewrite: () => Promise<void> }
      await state.rewrite()

      expect(complete).not.toHaveBeenCalled()
    })
  })
})
