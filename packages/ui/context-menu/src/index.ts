export interface ContextMenuItem {
  label: string
  command: () => void
  disabled?: boolean
  separator?: boolean
}

export interface ContextMenuOptions {
  items: ContextMenuItem[]
  container?: HTMLElement
}

export class ContextMenu {
  private menu: HTMLElement | null = null
  private container: HTMLElement

  constructor(options: ContextMenuOptions) {
    this.container = options.container ?? document.body
  }

  show(x: number, y: number, items: ContextMenuItem[]): void {
    this.hide()

    this.menu = document.createElement('div')
    this.menu.className = 'verso-context-menu'
    this.menu.style.position = 'fixed'
    this.menu.style.left = `${x}px`
    this.menu.style.top = `${y}px`
    this.menu.style.zIndex = '10000'

    for (const item of items) {
      if (item.separator) {
        const separator = document.createElement('div')
        separator.className = 'verso-context-menu-separator'
        this.menu.appendChild(separator)
        continue
      }

      const menuItem = document.createElement('div')
      menuItem.className = 'verso-context-menu-item'
      menuItem.textContent = item.label

      if (item.disabled) {
        menuItem.classList.add('verso-context-menu-item-disabled')
      } else {
        menuItem.addEventListener('click', () => {
          item.command()
          this.hide()
        })
      }

      this.menu.appendChild(menuItem)
    }

    this.container.appendChild(this.menu)
    document.addEventListener('click', this.handleOutsideClick)
    document.addEventListener('keydown', this.handleEscape)
  }

  hide(): void {
    if (this.menu) {
      this.menu.remove()
      this.menu = null
    }
    document.removeEventListener('click', this.handleOutsideClick)
    document.removeEventListener('keydown', this.handleEscape)
  }

  private handleOutsideClick = (e: MouseEvent): void => {
    if (this.menu && !this.menu.contains(e.target as Node)) {
      this.hide()
    }
  }

  private handleEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      this.hide()
    }
  }

  destroy(): void {
    this.hide()
  }
}
