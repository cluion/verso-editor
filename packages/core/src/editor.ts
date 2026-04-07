import { baseKeymap, toggleMark } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { DOMParser, DOMSerializer, type Schema } from 'prosemirror-model'
import { EditorState, type Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { EventEmitter } from './event-emitter'
import { createInputRulesPlugin } from './input-rules'
import { defaultSchema } from './schema'

type EditorEvents = {
  update: (json: Record<string, unknown>) => void
  focus: () => void
  blur: () => void
  destroy: () => void
}

interface EditorOptions {
  element: HTMLElement
  content?: string
  schema?: Schema
  plugins?: Plugin[]
}

export class Editor {
  private emitter = new EventEmitter<EditorEvents>()
  readonly view: EditorView
  readonly schema: Schema

  constructor(options: EditorOptions) {
    this.schema = options.schema ?? defaultSchema
    const plugins = this.createPlugins(options.plugins)

    const doc = this.parseContent(options.content ?? '<p></p>')

    this.view = new EditorView(options.element, {
      state: EditorState.create({ doc, plugins }),
      dispatchTransaction: (tr) => {
        const newState = this.view.state.apply(tr)
        this.view.updateState(newState)
        if (tr.docChanged) {
          this.emitter.emit('update', this.getJSON())
        }
      },
      handleDOMEvents: {
        focus: () => {
          this.emitter.emit('focus')
          return false
        },
        blur: () => {
          this.emitter.emit('blur')
          return false
        },
      },
    })
  }

  on<K extends keyof EditorEvents>(event: K, handler: EditorEvents[K]): this {
    this.emitter.on(event, handler)
    return this
  }

  off<K extends keyof EditorEvents>(event: K, handler: EditorEvents[K]): this {
    this.emitter.off(event, handler)
    return this
  }

  setContent(html: string): this {
    const doc = this.parseContent(html)
    const state = EditorState.create({
      doc,
      plugins: this.view.state.plugins,
    })
    this.view.updateState(state)
    this.emitter.emit('update', this.getJSON())
    return this
  }

  getJSON(): Record<string, unknown> {
    return this.view.state.doc.toJSON() as Record<string, unknown>
  }

  getHTML(): string {
    const fragment = DOMSerializer.fromSchema(this.schema).serializeFragment(
      this.view.state.doc.content,
    )
    const div = document.createElement('div')
    div.appendChild(fragment)
    return div.innerHTML
  }

  insertContent(content: string): this {
    const doc = this.parseContent(content)
    const slice = doc.slice(0, doc.content.size)
    const tr = this.view.state.tr.replaceSelection(slice)
    this.view.dispatch(tr)
    return this
  }

  destroy(): void {
    this.emitter.emit('destroy')
    this.view.destroy()
    this.emitter.destroy()
  }

  private parseContent(html: string): ProseMirrorNode {
    const div = document.createElement('div')
    // html is from setContent/insertContent (developer-provided), not raw user input.
    // ProseMirror's DOMParser + schema validation sanitizes it.
    div.innerHTML = html
    return DOMParser.fromSchema(this.schema).parse(div)
  }

  private createPlugins(extra?: Plugin[]): Plugin[] {
    const plugins: Plugin[] = [
      history(),
      createInputRulesPlugin(this.schema),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
        'Mod-b': toggleMark(this.schema.marks.bold),
        'Mod-i': toggleMark(this.schema.marks.italic),
      }),
      keymap(baseKeymap),
    ]

    if (extra) {
      plugins.push(...extra)
    }

    return plugins
  }
}
