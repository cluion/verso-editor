type Handler = (...args: never[]) => void

export class EventEmitter<Events extends Record<string, Handler>> {
  private listeners = new Map<keyof Events, Set<Handler>>()

  on<K extends keyof Events>(event: K, handler: Events[K]): this {
    let set = this.listeners.get(event)
    if (!set) {
      set = new Set()
      this.listeners.set(event, set)
    }
    set.add(handler as Handler)
    return this
  }

  off<K extends keyof Events>(event: K, handler: Events[K]): this {
    this.listeners.get(event)?.delete(handler as Handler)
    return this
  }

  once<K extends keyof Events>(event: K, handler: Events[K]): this {
    const wrapper = ((...args: never[]) => {
      this.off(event, wrapper as Events[K])
      handler(...args)
    }) as Events[K]
    return this.on(event, wrapper)
  }

  emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): this {
    const set = this.listeners.get(event)
    if (set) {
      for (const handler of set) {
        handler(...(args as never[]))
      }
    }
    return this
  }

  destroy(): void {
    this.listeners.clear()
  }
}
