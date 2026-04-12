import { describe, expect, it } from 'vitest'
import { TaskItemExtension, TaskListExtension, createTaskItemNodeView } from '../index'

describe('TaskListExtension', () => {
  it('has name taskList', () => {
    expect(TaskListExtension.name).toBe('taskList')
  })

  it('has nodeSpec with taskItem+ content', () => {
    expect(TaskListExtension.nodeSpec.content).toBe('taskItem+')
  })

  it('parses <ul data-type="taskList">', () => {
    expect(TaskListExtension.nodeSpec.parseDOM).toEqual([{ tag: 'ul[data-type="taskList"]' }])
  })

  it('outputs <ul data-type="taskList">', () => {
    const result = TaskListExtension.nodeSpec.toDOM?.()
    expect(result).toEqual(['ul', { 'data-type': 'taskList' }, 0])
  })
})

describe('TaskItemExtension', () => {
  it('has name taskItem', () => {
    expect(TaskItemExtension.name).toBe('taskItem')
  })

  it('has checked attr defaulting to false', () => {
    const attrs = TaskItemExtension.nodeSpec.attrs as Record<string, { default: boolean }>
    expect(attrs.checked).toBeDefined()
    expect(attrs.checked.default).toBe(false)
  })

  it('has content allowing inline*', () => {
    expect(TaskItemExtension.nodeSpec.content).toBe('inline*')
  })

  it('parses <li data-type="taskItem"> with data-checked', () => {
    const parseDOM = TaskItemExtension.nodeSpec.parseDOM as {
      tag: string
      getAttrs: (dom: HTMLElement) => unknown
    }[]
    expect(parseDOM[0].tag).toBe('li[data-type="taskItem"]')

    const el = document.createElement('li')
    el.setAttribute('data-type', 'taskItem')
    el.setAttribute('data-checked', 'true')
    const result = parseDOM[0].getAttrs(el)
    expect(result).toEqual({ checked: true })
  })

  it('has a nodeView', () => {
    expect(TaskItemExtension.nodeView).toBeDefined()
  })
})

describe('createTaskItemNodeView', () => {
  it('returns a NodeView factory function', () => {
    expect(typeof createTaskItemNodeView).toBe('function')
  })
})
