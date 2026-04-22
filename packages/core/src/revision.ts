import type { Node as ProseMirrorNode } from 'prosemirror-model'

export interface RevisionSnapshot {
  id: string
  timestamp: number
  doc: Record<string, unknown>
}

let revisionCounter = 0

export function createSnapshot(doc: ProseMirrorNode): RevisionSnapshot {
  revisionCounter++
  return {
    id: `rev-${revisionCounter}`,
    timestamp: Date.now(),
    doc: doc.toJSON() as Record<string, unknown>,
  }
}

export function compareSnapshots(
  a: RevisionSnapshot,
  b: RevisionSnapshot,
): { added: number; removed: number; changed: number } {
  const jsonA = JSON.stringify(a.doc)
  const jsonB = JSON.stringify(b.doc)

  if (jsonA === jsonB) {
    return { added: 0, removed: 0, changed: 0 }
  }

  const textA = extractText(a.doc)
  const textB = extractText(b.doc)

  const linesA = textA.split('\n')
  const linesB = textB.split('\n')

  let added = 0
  let removed = 0
  let changed = 0

  const maxLen = Math.max(linesA.length, linesB.length)
  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i]
    const lineB = linesB[i]
    if (lineA === undefined && lineB !== undefined) {
      added++
    } else if (lineA !== undefined && lineB === undefined) {
      removed++
    } else if (lineA !== lineB) {
      changed++
    }
  }

  return { added, removed, changed }
}

function extractText(doc: Record<string, unknown>): string {
  const parts: string[] = []
  extractTextRecursive(doc, parts)
  return parts.join('\n')
}

function extractTextRecursive(node: unknown, parts: string[]): void {
  if (!node || typeof node !== 'object') return
  const obj = node as Record<string, unknown>

  if (obj.type === 'text' && typeof obj.text === 'string') {
    parts.push(obj.text)
  }

  if (Array.isArray(obj.content)) {
    for (const child of obj.content) {
      extractTextRecursive(child, parts)
    }
  }
}

export class RevisionHistory {
  private snapshots: RevisionSnapshot[] = []

  add(snapshot: RevisionSnapshot): void {
    this.snapshots = [...this.snapshots, snapshot]
  }

  getAll(): RevisionSnapshot[] {
    return [...this.snapshots]
  }

  getAt(index: number): RevisionSnapshot | undefined {
    return this.snapshots[index]
  }

  compare(indexA: number, indexB: number): ReturnType<typeof compareSnapshots> | null {
    const a = this.snapshots[indexA]
    const b = this.snapshots[indexB]
    if (!a || !b) return null
    return compareSnapshots(a, b)
  }

  get length(): number {
    return this.snapshots.length
  }
}
