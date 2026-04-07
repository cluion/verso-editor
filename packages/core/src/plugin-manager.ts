import type { Extension } from './extension'

type AnyExtension = Extension

export function sortExtensions(extensions: AnyExtension[]): AnyExtension[] {
  const nameMap = new Map<string, AnyExtension>()
  for (const ext of extensions) {
    nameMap.set(ext.name, ext)
  }

  // Check for missing dependencies
  for (const ext of extensions) {
    for (const dep of ext.dependencies) {
      if (!nameMap.has(dep)) {
        throw new Error(`Missing dependency: "${dep}" required by "${ext.name}"`)
      }
    }
  }

  // DFS topological sort
  const visited = new Set<string>()
  const visiting = new Set<string>()
  const sorted: AnyExtension[] = []

  function visit(ext: AnyExtension) {
    if (visited.has(ext.name)) return
    if (visiting.has(ext.name)) {
      throw new Error(`Circular dependency detected involving "${ext.name}"`)
    }
    visiting.add(ext.name)
    for (const dep of ext.dependencies) {
      visit(nameMap.get(dep) as AnyExtension)
    }
    visiting.delete(ext.name)
    visited.add(ext.name)
    sorted.push(ext)
  }

  for (const ext of extensions) {
    visit(ext)
  }

  return sorted
}
