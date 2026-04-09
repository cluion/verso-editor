import type { Plugin } from 'prosemirror-state'
import { yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror'
import type * as Y from 'yjs'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

export interface CollaborationUser {
  name: string
  color: string
}

export interface CollaborationOptions {
  ydoc: Y.Doc
  user?: CollaborationUser
  awareness?: AwarenessLike
}

/** Minimal awareness interface compatible with yjs/awareness */
export interface AwarenessLike {
  getLocalState: () => Record<string, unknown> | null
  setLocalState: (state: Record<string, unknown>) => void
  getStates: () => Map<number, Record<string, unknown>>
  on: (event: string, handler: (...args: unknown[]) => void) => void
  off: (event: string, handler: (...args: unknown[]) => void) => void
}

export interface WebSocketProviderOptions {
  url: string
  roomName: string
  ydoc: Y.Doc
  onStatusChange?: (status: ConnectionStatus) => void
}

export interface WebSocketProviderWrapper {
  connect: () => void
  disconnect: () => void
  destroy: () => void
  getStatus: () => ConnectionStatus
  awareness: unknown
}

/**
 * Create the set of ProseMirror plugins for real-time collaboration:
 * - ySyncPlugin: syncs ProseMirror doc ↔ Y.Doc
 * - yCursorPlugin: renders remote collaborator cursors
 * - yUndoPlugin: collaborative undo/redo (local-only)
 */
export function createCollaborationPlugins(options: CollaborationOptions): Plugin[] {
  const { ydoc, user, awareness } = options
  const yXmlFragment = ydoc.getXmlFragment('prosemirror')

  const syncPlugin = ySyncPlugin(yXmlFragment)
  const undoPlugin = yUndoPlugin()

  const plugins: Plugin[] = [syncPlugin, undoPlugin]

  // Cursor plugin renders remote collaborator cursors via awareness
  if (awareness) {
    const cursorPlugin = yCursorPlugin(awareness as never)
    plugins.push(cursorPlugin)

    // Set local user info on awareness
    if (user) {
      awareness.setLocalState({ ...awareness.getLocalState(), user })
    }
  }

  return plugins
}

/**
 * Create a WebSocket provider wrapper for Y.Doc synchronization.
 * Wraps y-websocket's WebsocketProvider with a connection status interface.
 */
export function createWebSocketProvider(
  options: WebSocketProviderOptions,
): WebSocketProviderWrapper {
  const { url, roomName, ydoc, onStatusChange } = options

  let status: ConnectionStatus = 'disconnected'

  // Lazy-load y-websocket to avoid hard dependency at import time
  let wsProvider: InstanceType<typeof import('y-websocket').WebsocketProvider> | null = null

  function setStatus(newStatus: ConnectionStatus): void {
    status = newStatus
    onStatusChange?.(newStatus)
  }

  return {
    connect(): void {
      if (wsProvider) {
        wsProvider.connect()
        return
      }
      try {
        // Dynamic import for y-websocket
        import('y-websocket').then(({ WebsocketProvider }) => {
          wsProvider = new WebsocketProvider(url, roomName, ydoc, {
            connect: true,
          })
          wsProvider.on('status', ({ status: wsStatus }: { status: string }) => {
            if (wsStatus === 'connected') {
              setStatus('connected')
            } else if (wsStatus === 'connecting') {
              setStatus('connecting')
            } else {
              setStatus('disconnected')
            }
          })
          setStatus('connecting')
        })
      } catch {
        setStatus('disconnected')
      }
    },

    disconnect(): void {
      wsProvider?.disconnect()
      setStatus('disconnected')
    },

    destroy(): void {
      wsProvider?.destroy()
      wsProvider = null
      setStatus('disconnected')
    },

    getStatus(): ConnectionStatus {
      return status
    },

    get awareness(): unknown {
      return wsProvider?.awareness ?? null
    },
  }
}
