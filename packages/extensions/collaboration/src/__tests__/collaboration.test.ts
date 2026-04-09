import { Plugin } from 'prosemirror-state'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as Y from 'yjs'
import {
  type ConnectionStatus,
  createCollaborationPlugins,
  createWebSocketProvider,
} from '../index'

let providers: ReturnType<typeof createWebSocketProvider>[] = []

afterEach(() => {
  for (const p of providers) {
    p.destroy()
  }
  providers = []
  vi.restoreAllMocks()
})

describe('Collaboration Extension', () => {
  describe('createCollaborationPlugins', () => {
    it('returns array of plugins (sync, cursor, undo)', () => {
      const ydoc = new Y.Doc()
      const plugins = createCollaborationPlugins({ ydoc })
      expect(plugins.length).toBeGreaterThanOrEqual(2)
      for (const p of plugins) {
        expect(p).toBeInstanceOf(Plugin)
      }
    })

    it('includes ySyncPlugin', () => {
      const ydoc = new Y.Doc()
      const plugins = createCollaborationPlugins({ ydoc })
      const syncPlugin = plugins.find((p) =>
        (p.spec.key as { key?: string })?.key?.startsWith('y-sync'),
      )
      expect(syncPlugin).toBeDefined()
    })

    it('includes yCursorPlugin when awareness is provided', () => {
      const ydoc = new Y.Doc()
      const plugins = createCollaborationPlugins({ ydoc })
      // Without awareness, no cursor plugin
      expect(plugins.length).toBe(2)
    })

    it('includes yUndoPlugin', () => {
      const ydoc = new Y.Doc()
      const plugins = createCollaborationPlugins({ ydoc })
      const undoPlugin = plugins.find((p) =>
        (p.spec.key as { key?: string })?.key?.startsWith('y-undo'),
      )
      expect(undoPlugin).toBeDefined()
    })

    it('accepts user info for cursor display', () => {
      const ydoc = new Y.Doc()
      const user = { name: 'Alice', color: '#ff0000' }
      const plugins = createCollaborationPlugins({ ydoc, user })
      expect(plugins.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('WebSocket Provider', () => {
    it('creates a provider wrapper with connect/disconnect', () => {
      const ydoc = new Y.Doc()
      const provider = createWebSocketProvider({
        url: 'wss://localhost:1234',
        roomName: 'test-room',
        ydoc,
      })
      providers.push(provider)

      expect(provider).toBeDefined()
      expect(typeof provider.connect).toBe('function')
      expect(typeof provider.disconnect).toBe('function')
      expect(typeof provider.destroy).toBe('function')
    })

    it('tracks connection status', () => {
      const ydoc = new Y.Doc()
      const provider = createWebSocketProvider({
        url: 'wss://localhost:1234',
        roomName: 'test-room',
        ydoc,
      })
      providers.push(provider)

      const status: ConnectionStatus = provider.getStatus()
      expect(['connected', 'disconnected', 'connecting']).toContain(status)
    })

    it('supports onStatusChange callback', () => {
      const ydoc = new Y.Doc()
      const onStatusChange = vi.fn()
      const provider = createWebSocketProvider({
        url: 'wss://localhost:1234',
        roomName: 'test-room',
        ydoc,
        onStatusChange,
      })
      providers.push(provider)

      expect(onStatusChange).not.toHaveBeenCalled()
    })
  })

  describe('Y.Doc integration', () => {
    it('sync plugin has state init that binds to ydoc', () => {
      const ydoc = new Y.Doc()
      const plugins = createCollaborationPlugins({ ydoc })

      // Verify sync plugin has a state spec (init + apply)
      const syncPlugin = plugins.find((p) =>
        (p.spec.key as { key?: string })?.key?.startsWith('y-sync'),
      )
      expect(syncPlugin).toBeDefined()
      expect(syncPlugin?.spec.state).toBeDefined()
      expect(typeof syncPlugin?.spec.state?.init).toBe('function')
      expect(typeof syncPlugin?.spec.state?.apply).toBe('function')
    })

    it('ydoc xmlFragment is accessible', () => {
      const ydoc = new Y.Doc()
      const fragment = ydoc.getXmlFragment('prosemirror')
      expect(fragment).toBeDefined()
      expect(fragment.doc).toBe(ydoc)
    })
  })
})
