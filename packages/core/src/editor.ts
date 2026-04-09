import { baseKeymap, toggleMark } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import type { Node as ProseMirrorNode } from 'prosemirror-model'
import { DOMParser, DOMSerializer, type Schema } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { EventEmitter } from './event-emitter'
import type { Extension, NodeViewFactory } from './extension'
import { createInputRulesPlugin } from './input-rules'
import { sortExtensions } from './plugin-manager'
import { defaultSchema } from './schema'
import { resolveSchema } from './schema-resolver'

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
  extensions?: Extension[]
  onError?: (error: Error) => void
  ariaLabel?: string
}

export class Editor {
  private emitter = new EventEmitter<EditorEvents>()
  private readonly errorHandler: (error: Error) => void
  private readonly ariaLabel: string
  private liveRegion: HTMLElement | null = null
  readonly view: EditorView
  readonly schema: Schema

  constructor(options: EditorOptions) {
    this.errorHandler = options.onError ?? ((error: Error) => console.error(error))
    this.ariaLabel = options.ariaLabel ?? 'Rich text editor'
    const extensionMode = options.extensions && options.extensions.length > 0

    if (extensionMode) {
      const sorted = sortExtensions(options.extensions ?? [])
      this.schema = options.schema ?? resolveSchema(sorted)
      const plugins = this.createExtensionPlugins(sorted, options.plugins)
      const nodeViews = this.collectNodeViews(sorted)
      const doc = this.parseContent(options.content ?? '<p></p>')
      this.view = this.createView(options.element, doc, plugins, nodeViews)
    } else {
      this.schema = options.schema ?? defaultSchema
      const plugins = this.createDefaultPlugins(options.plugins)
      const doc = this.parseContent(options.content ?? '<p></p>')
      this.view = this.createView(options.element, doc, plugins)
    }

    this.setupAccessibility(options.element)
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
    try {
      this.view.updateState(state)
    } catch (error) {
      this.errorHandler(error instanceof Error ? error : new Error(String(error)))
    }
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
    try {
      this.view.destroy()
    } catch (error) {
      this.errorHandler(error instanceof Error ? error : new Error(String(error)))
    }
    this.emitter.destroy()
    this.liveRegion?.remove()
    this.liveRegion = null
  }

  /**
   * Announce a message to screen readers via the aria-live region.
   */
  announce(message: string): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = message
    }
  }

  private setupAccessibility(element: HTMLElement): void {
    // Set ARIA attributes on the contenteditable element
    this.view.dom.setAttribute('role', 'textbox')
    this.view.dom.setAttribute('aria-multiline', 'true')
    this.view.dom.setAttribute('aria-label', this.ariaLabel)

    // Create visually hidden live region for screen reader announcements
    this.liveRegion = document.createElement('div')
    this.liveRegion.setAttribute('aria-live', 'polite')
    this.liveRegion.className = 'vs-sr-only'
    this.liveRegion.style.position = 'absolute'
    this.liveRegion.style.width = '1px'
    this.liveRegion.style.height = '1px'
    this.liveRegion.style.overflow = 'hidden'
    this.liveRegion.style.clip = 'rect(0, 0, 0, 0)'
    this.liveRegion.style.whiteSpace = 'nowrap'
    element.appendChild(this.liveRegion)
  }

  private parseContent(html: string): ProseMirrorNode {
    const div = document.createElement('div')
    // html is from setContent/insertContent (developer-provided), not raw user input.
    // ProseMirror's DOMParser + schema validation sanitizes it.
    div.innerHTML = html
    return DOMParser.fromSchema(this.schema).parse(div)
  }

  private createView(
    element: HTMLElement,
    doc: ProseMirrorNode,
    plugins: Plugin[],
    nodeViews?: Record<string, NodeViewFactory>,
  ): EditorView {
    // Wrap plugin view methods with error boundary
    const wrappedPlugins = plugins.map((plugin) => this.wrapPluginWithBoundary(plugin))

    return new EditorView(element, {
      state: EditorState.create({ doc, plugins: wrappedPlugins }),
      nodeViews,
      dispatchTransaction: (tr) => {
        const newState = this.view.state.apply(tr)
        try {
          this.view.updateState(newState)
        } catch (error) {
          this.errorHandler(error instanceof Error ? error : new Error(String(error)))
        }
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

  private createDefaultPlugins(extra?: Plugin[]): Plugin[] {
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

  private createExtensionPlugins(extensions: Extension[], extra?: Plugin[]): Plugin[] {
    const plugins: Plugin[] = []

    for (const ext of extensions) {
      if (ext.plugins) {
        for (const factory of ext.plugins) {
          try {
            const result = factory()
            if (result instanceof Plugin) {
              plugins.push(result)
            }
          } catch (error) {
            this.errorHandler(error instanceof Error ? error : new Error(String(error)))
          }
        }
      }
    }

    if (extra) {
      plugins.push(...extra)
    }

    // Fallback base keymap
    plugins.push(keymap(baseKeymap))

    return plugins
  }

  private collectNodeViews(extensions: Extension[]): Record<string, NodeViewFactory> {
    const nodeViews: Record<string, NodeViewFactory> = {}

    for (const ext of extensions) {
      if (ext.nodeView && 'nodeSpec' in ext) {
        nodeViews[ext.name] = ext.nodeView
      }
    }

    return nodeViews
  }

  /**
   * Wrap a plugin's view methods with error boundary.
   * Catches errors in update() and destroy() and routes them to onError.
   */
  private wrapPluginWithBoundary(plugin: Plugin): Plugin {
    const originalSpec = plugin.spec
    const originalView = originalSpec.view

    if (!originalView) return plugin

    const errorHandler = this.errorHandler

    const wrappedSpec = {
      ...originalSpec,
      view: (editorView: EditorView) => {
        const viewResult = originalView(editorView)
        return {
          update: viewResult.update
            ? (view: EditorView, prevState: EditorState) => {
                try {
                  viewResult.update?.(view, prevState)
                } catch (error) {
                  errorHandler(error instanceof Error ? error : new Error(String(error)))
                }
              }
            : undefined,
          destroy: viewResult.destroy
            ? () => {
                try {
                  viewResult.destroy?.()
                } catch (error) {
                  errorHandler(error instanceof Error ? error : new Error(String(error)))
                }
              }
            : undefined,
        }
      },
    }

    return new Plugin(wrappedSpec)
  }
}
