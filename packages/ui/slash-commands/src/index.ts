import type { I18n } from '@verso-editor/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

export interface SlashCommandItem {
  title: string
  description: string
  command: string
}

interface SlashMenuState {
  active: boolean
  query: string
  range: { from: number; to: number } | null
  selectedIndex: number
}

interface SlashCommandOptions {
  commands: SlashCommandItem[]
  i18n?: I18n
}

const slashKey = new PluginKey('versoSlashCommand')

export function createSlashCommandPlugin(options: SlashCommandOptions): Plugin {
  const { commands, i18n } = options

  return new Plugin({
    key: slashKey,
    state: {
      init: (): SlashMenuState => ({
        active: false,
        query: '',
        range: null,
        selectedIndex: 0,
      }),
      apply: (tr, value) => {
        const meta = tr.getMeta(slashKey)
        if (meta) return meta
        return value
      },
    },
    view(editorView: EditorView) {
      let menu: HTMLElement | null = null
      let menuIdCounter = 0
      const menuId = `vs-slash-menu-${menuIdCounter++}`

      function createMenu(): HTMLElement {
        const el = document.createElement('div')
        el.classList.add('vs-slash-menu')
        el.id = menuId
        el.setAttribute('role', 'listbox')
        el.setAttribute('aria-label', i18n?.t('slashCommands.ariaLabel') ?? 'Slash commands')
        el.style.display = 'none'
        el.style.position = 'absolute'
        el.style.zIndex = '1000'
        return el
      }

      function renderItems(view: EditorView, state: SlashMenuState): void {
        if (!menu) return

        const filtered = commands.filter((cmd) =>
          cmd.title.toLowerCase().includes(state.query.toLowerCase()),
        )

        if (!state.active || filtered.length === 0) {
          menu.style.display = 'none'
          return
        }

        menu.replaceChildren()
        menu.style.display = 'block'

        filtered.forEach((cmd, index) => {
          const item = document.createElement('div')
          item.classList.add('vs-slash-menu__item')
          item.id = `${menuId}-item-${index}`
          item.setAttribute('role', 'option')
          item.setAttribute('aria-selected', index === state.selectedIndex ? 'true' : 'false')
          if (index === state.selectedIndex) {
            item.classList.add('vs-slash-menu__item--active')
          }

          const title = document.createElement('span')
          title.classList.add('vs-slash-menu__title')
          title.textContent = cmd.title

          const desc = document.createElement('span')
          desc.classList.add('vs-slash-menu__desc')
          desc.textContent = cmd.description

          item.appendChild(title)
          item.appendChild(desc)

          item.addEventListener('mousedown', (e) => {
            e.preventDefault()
            selectItem(view, cmd, state)
          })

          menu?.appendChild(item)
        })

        // Position near cursor
        if (state.range) {
          try {
            const coords = view.coordsAtPos(state.range.from)
            menu.style.top = `${coords.bottom + 4}px`
            menu.style.left = `${coords.left}px`
          } catch {
            // coordsAtPos may fail in jsdom without layout; skip positioning
          }
        }

        // Update aria-activedescendant to point at the selected item
        const activeItemId = `${menuId}-item-${state.selectedIndex}`
        menu.setAttribute('aria-activedescendant', activeItemId)
      }

      function selectItem(view: EditorView, _item: SlashCommandItem, state: SlashMenuState): void {
        if (!state.range) return
        // Delete the slash query and close menu
        const tr = view.state.tr.delete(state.range.from, state.range.to).setMeta(slashKey, {
          active: false,
          query: '',
          range: null,
          selectedIndex: 0,
        })
        view.dispatch(tr)
      }

      menu = createMenu()
      editorView.dom.parentElement?.appendChild(menu)

      const offLocaleChange = i18n?.onChange(() => {
        menu?.setAttribute('aria-label', i18n?.t('slashCommands.ariaLabel') ?? 'Slash commands')
      })

      return {
        update(view: EditorView) {
          const state = slashKey.getState(view.state) as SlashMenuState
          renderItems(view, state)
        },
        destroy() {
          offLocaleChange?.()
          menu?.remove()
          menu = null
        },
      }
    },
    props: {
      handleKeyDown(view, event) {
        const state = slashKey.getState(view.state) as SlashMenuState

        if (state.active) {
          if (event.key === 'ArrowDown') {
            const filtered = commands.filter((cmd) =>
              cmd.title.toLowerCase().includes(state.query.toLowerCase()),
            )
            const nextIndex = (state.selectedIndex + 1) % filtered.length
            const tr = view.state.tr.setMeta(slashKey, {
              ...state,
              selectedIndex: nextIndex,
            })
            view.dispatch(tr)
            return true
          }
          if (event.key === 'ArrowUp') {
            const filtered = commands.filter((cmd) =>
              cmd.title.toLowerCase().includes(state.query.toLowerCase()),
            )
            const prevIndex = (state.selectedIndex - 1 + filtered.length) % filtered.length
            const tr = view.state.tr.setMeta(slashKey, {
              ...state,
              selectedIndex: prevIndex,
            })
            view.dispatch(tr)
            return true
          }
          if (event.key === 'Escape') {
            const tr = view.state.tr.setMeta(slashKey, {
              active: false,
              query: '',
              range: null,
              selectedIndex: 0,
            })
            view.dispatch(tr)
            return true
          }
          if (event.key === 'Enter') {
            const filtered = commands.filter((cmd) =>
              cmd.title.toLowerCase().includes(state.query.toLowerCase()),
            )
            if (filtered[state.selectedIndex] && state.range) {
              const tr = view.state.tr.delete(state.range.from, state.range.to).setMeta(slashKey, {
                active: false,
                query: '',
                range: null,
                selectedIndex: 0,
              })
              view.dispatch(tr)
            }
            return true
          }
        }

        // Detect '/' character
        if (event.key === '/' && !state.active) {
          const { from } = view.state.selection
          const tr = view.state.tr.setMeta(slashKey, {
            active: true,
            query: '',
            range: { from, to: from + 1 },
            selectedIndex: 0,
          })
          view.dispatch(tr)
        }

        return false
      },
    },
  })
}
