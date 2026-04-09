import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

export interface AIStreamChunk {
  text?: string
  done?: boolean
}

export interface AIPromptOptions {
  instruction?: string
}

export interface AIConfig {
  complete?: (text: string, options: AIPromptOptions) => Promise<string>
  stream?: (text: string, options?: AIPromptOptions) => AsyncGenerator<AIStreamChunk>
}

export interface AIPluginOptions {
  ai: AIConfig
  onError?: (error: Error) => void
}

export interface AICommands {
  rewrite: () => Promise<void>
  translate: (lang: string) => Promise<void>
  summarize: () => Promise<void>
  autocomplete: () => Promise<string>
}

const aiPluginKey = new PluginKey('versoAI')

function getSelectedText(view: EditorView): string | null {
  const { from, to, empty } = view.state.selection
  if (empty || from === to) return null
  return view.state.doc.textBetween(from, to)
}

function replaceSelection(view: EditorView, text: string): void {
  const { from, to } = view.state.selection
  const tr = view.state.tr.insertText(text, from, to)
  view.dispatch(tr)
}

export function createAIPlugin(options: AIPluginOptions): Plugin {
  const { ai, onError } = options

  // Per-instance view reference
  const viewRef: { current: EditorView | null } = { current: null }

  function handleError(error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error))
    onError?.(err)
  }

  const commands: AICommands = {
    async rewrite(): Promise<void> {
      const view = viewRef.current
      if (!view || !ai.complete) return
      const text = getSelectedText(view)
      if (text === null) return
      try {
        const result = await ai.complete(text, { instruction: 'Rewrite the following text' })
        replaceSelection(view, result)
      } catch (error) {
        handleError(error)
      }
    },

    async translate(lang: string): Promise<void> {
      const view = viewRef.current
      if (!view || !ai.complete) return
      const text = getSelectedText(view)
      if (text === null) return
      try {
        const result = await ai.complete(text, {
          instruction: `Translate the following text to ${lang}`,
        })
        replaceSelection(view, result)
      } catch (error) {
        handleError(error)
      }
    },

    async summarize(): Promise<void> {
      const view = viewRef.current
      if (!view || !ai.complete) return
      const text = getSelectedText(view)
      if (text === null) return
      try {
        const result = await ai.complete(text, {
          instruction: 'Summarize the following text',
        })
        const { to } = view.state.selection
        const tr = view.state.tr.insertText(`\n${result}`, to)
        view.dispatch(tr)
      } catch (error) {
        handleError(error)
      }
    },

    async autocomplete(): Promise<string> {
      const view = viewRef.current
      if (!view || !ai.stream) return ''
      const { from } = view.state.selection
      const textBefore = view.state.doc.textBetween(1, from, '\n')
      try {
        let accumulated = ''
        const gen = ai.stream(textBefore)
        for await (const chunk of gen) {
          if (chunk.text) {
            accumulated += chunk.text
          }
          if (chunk.done) break
        }
        return accumulated
      } catch (error) {
        handleError(error)
        return ''
      }
    },
  }

  return new Plugin({
    key: aiPluginKey,
    state: {
      init() {
        return commands
      },
      apply(_tr, value) {
        return value
      },
    },
    view() {
      return {
        update(view: EditorView) {
          viewRef.current = view
        },
        destroy() {},
      }
    },
  })
}
