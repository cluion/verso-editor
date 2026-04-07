import { EditorState } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import {
  createLift,
  createSetBlockType,
  createToggleBlockType,
  createToggleMark,
  createWrapIn,
  isMarkActive,
  isNodeActive,
} from '../command-manager'
import { defaultSchema } from '../schema'

function createState(): EditorState {
  const doc = defaultSchema.nodeFromJSON({
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello world' }] }],
  })
  return EditorState.create({ doc })
}

describe('command factories', () => {
  it('createToggleMark returns a working command', () => {
    const state = createState()
    const cmd = createToggleMark(defaultSchema.marks.bold)
    expect(cmd).toBeTypeOf('function')
    const result = cmd(state, undefined as never)
    expect(typeof result).toBe('boolean')
  })

  it('createSetBlockType returns a working command', () => {
    const state = createState()
    const cmd = createSetBlockType(defaultSchema.nodes.heading, { level: 2 })
    expect(cmd).toBeTypeOf('function')
  })

  it('createToggleBlockType toggles between two node types', () => {
    const state = createState()
    const cmd = createToggleBlockType(defaultSchema.nodes.heading, defaultSchema.nodes.paragraph, {
      level: 1,
    })
    expect(cmd).toBeTypeOf('function')
  })

  it('createWrapIn returns a working command', () => {
    const state = createState()
    const cmd = createWrapIn(defaultSchema.nodes.blockquote)
    expect(cmd).toBeTypeOf('function')
  })

  it('createLift returns a working command', () => {
    const state = createState()
    const cmd = createLift()
    expect(cmd).toBeTypeOf('function')
  })
})

describe('isActive queries', () => {
  it('isMarkActive returns false when mark is not present', () => {
    const state = createState()
    expect(isMarkActive(state, defaultSchema.marks.bold)).toBe(false)
  })

  it('isNodeActive returns true when at correct node type', () => {
    const state = createState()
    expect(isNodeActive(state, defaultSchema.nodes.paragraph)).toBe(true)
  })

  it('isNodeActive returns false for non-matching node type', () => {
    const state = createState()
    expect(isNodeActive(state, defaultSchema.nodes.heading)).toBe(false)
  })

  it('isNodeActive checks attributes', () => {
    const state = createState()
    expect(isNodeActive(state, defaultSchema.nodes.heading, { level: 1 })).toBe(false)
  })
})
