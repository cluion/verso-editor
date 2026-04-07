import { describe, expect, it, vi } from 'vitest'
import { EventEmitter } from '../event-emitter'

type TestEvents = {
  change: (value: string) => void
  focus: () => void
  blur: () => void
  destroy: () => void
}

describe('EventEmitter', () => {
  it('registers and triggers event handlers via on/emit', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()
    emitter.on('change', handler)
    emitter.emit('change', 'hello')
    expect(handler).toHaveBeenCalledWith('hello')
  })

  it('supports multiple handlers for the same event', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    emitter.on('change', handler1)
    emitter.on('change', handler2)
    emitter.emit('change', 'hello')
    expect(handler1).toHaveBeenCalledWith('hello')
    expect(handler2).toHaveBeenCalledWith('hello')
  })

  it('removes handler via off', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()
    emitter.on('change', handler)
    emitter.off('change', handler)
    emitter.emit('change', 'hello')
    expect(handler).not.toHaveBeenCalled()
  })

  it('off does nothing for unregistered handler', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()
    expect(() => emitter.off('change', handler)).not.toThrow()
  })

  it('fires handler only once via once', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()
    emitter.once('change', handler)
    emitter.emit('change', 'first')
    emitter.emit('change', 'second')
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('first')
  })

  it('emits events with no arguments', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()
    emitter.on('focus', handler)
    emitter.emit('focus')
    expect(handler).toHaveBeenCalledOnce()
  })

  it('clears all handlers on destroy', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    emitter.on('change', handler1)
    emitter.on('focus', handler2)
    emitter.destroy()
    emitter.emit('change', 'hello')
    emitter.emit('focus')
    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
  })

  it('destroy is idempotent', () => {
    const emitter = new EventEmitter<TestEvents>()
    expect(() => {
      emitter.destroy()
      emitter.destroy()
    }).not.toThrow()
  })
})
