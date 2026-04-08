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
  })
})
