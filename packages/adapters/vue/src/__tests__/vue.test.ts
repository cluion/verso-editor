import { Editor } from '@verso-editor/core'
import { type VueWrapper, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { EditorContent, useEditor } from '../index'

let wrappers: VueWrapper[] = []

afterEach(() => {
  for (const w of wrappers) {
    w.unmount()
  }
  wrappers = []
})

describe('Vue 3 Adapter', () => {
  describe('useEditor', () => {
    it('creates editor instance', async () => {
      const TestComponent = defineComponent({
        setup() {
          const editor = useEditor()
          return { editor }
        },
        render() {
          return this.editor ? h(EditorContent, { editor: this.editor }) : null
        },
      })
      const wrapper = mount(TestComponent)
      wrappers.push(wrapper)
      await nextTick()

      const vm = wrapper.vm as unknown as { editor: Editor | null }
      expect(vm.editor).toBeInstanceOf(Editor)
    })

    it('destroys editor on unmount', async () => {
      const destroySpy = vi.spyOn(Editor.prototype, 'destroy')
      const TestComponent = defineComponent({
        setup() {
          const editor = useEditor()
          return { editor }
        },
        render() {
          return this.editor ? h(EditorContent, { editor: this.editor }) : null
        },
      })
      const wrapper = mount(TestComponent)
      wrappers.push(wrapper)
      await nextTick()
      wrapper.unmount()
      wrappers = []

      expect(destroySpy).toHaveBeenCalled()
      destroySpy.mockRestore()
    })

    it('accepts extensions option', async () => {
      const TestComponent = defineComponent({
        setup() {
          const editor = useEditor({ extensions: [] })
          return { editor }
        },
        render() {
          return this.editor ? h(EditorContent, { editor: this.editor }) : null
        },
      })
      const wrapper = mount(TestComponent)
      wrappers.push(wrapper)
      await nextTick()

      const vm = wrapper.vm as unknown as { editor: Editor | null }
      expect(vm.editor).toBeInstanceOf(Editor)
    })

    it('accepts content option', async () => {
      const TestComponent = defineComponent({
        setup() {
          const editor = useEditor({ content: '<p>Hello Vue</p>' })
          return { editor }
        },
        render() {
          return this.editor ? h(EditorContent, { editor: this.editor }) : null
        },
      })
      const wrapper = mount(TestComponent)
      wrappers.push(wrapper)
      await nextTick()

      const vm = wrapper.vm as unknown as { editor: Editor | null }
      expect(vm.editor).toBeInstanceOf(Editor)
      expect(vm.editor?.getHTML()).toContain('Hello Vue')
    })
  })

  describe('EditorContent', () => {
    it('renders editor DOM element', async () => {
      const TestComponent = defineComponent({
        setup() {
          const editor = useEditor()
          return { editor }
        },
        render() {
          return this.editor ? h(EditorContent, { editor: this.editor }) : null
        },
      })
      const wrapper = mount(TestComponent)
      wrappers.push(wrapper)
      await nextTick()

      const editorEl = wrapper.find('.ProseMirror')
      expect(editorEl.exists()).toBe(true)
    })

    it('renders editor DOM with initial content', async () => {
      const TestComponent = defineComponent({
        setup() {
          const editor = useEditor({ content: '<p>Test content</p>' })
          return { editor }
        },
        render() {
          return this.editor ? h(EditorContent, { editor: this.editor }) : null
        },
      })
      const wrapper = mount(TestComponent)
      wrappers.push(wrapper)
      await nextTick()

      const pm = wrapper.find('.ProseMirror')
      expect(pm.text()).toContain('Test content')
    })
  })

  describe('onError callback', () => {
    it('passes onError to editor constructor', async () => {
      const onError = vi.fn()
      const TestComponent = defineComponent({
        setup() {
          const editor = useEditor({ onError })
          return { editor }
        },
        render() {
          return this.editor ? h(EditorContent, { editor: this.editor }) : null
        },
      })
      const wrapper = mount(TestComponent)
      wrappers.push(wrapper)
      await nextTick()

      const vm = wrapper.vm as unknown as { editor: Editor | null }
      expect(vm.editor).toBeInstanceOf(Editor)
    })
  })

  describe('Multiple instances', () => {
    it('each instance is independent', async () => {
      const TestComponent1 = defineComponent({
        setup() {
          const editor = useEditor({ content: '<p>First</p>' })
          return { editor }
        },
        render() {
          return this.editor ? h(EditorContent, { editor: this.editor }) : null
        },
      })
      const TestComponent2 = defineComponent({
        setup() {
          const editor = useEditor({ content: '<p>Second</p>' })
          return { editor }
        },
        render() {
          return this.editor ? h(EditorContent, { editor: this.editor }) : null
        },
      })
      const w1 = mount(TestComponent1)
      const w2 = mount(TestComponent2)
      wrappers.push(w1, w2)
      await nextTick()

      const vm1 = w1.vm as unknown as { editor: Editor | null }
      const vm2 = w2.vm as unknown as { editor: Editor | null }
      expect(vm1.editor?.getHTML()).toContain('First')
      expect(vm2.editor?.getHTML()).toContain('Second')
    })
  })
})
