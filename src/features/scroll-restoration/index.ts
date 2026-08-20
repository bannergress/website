import { History } from 'history'

export interface ScrollTarget {
  getScrollTop: () => number | undefined
  setScrollTop: (scrollTop: number) => boolean
}

type ScrollRestorationOptions = {
  key: string | (() => string)
  target?: ScrollTarget
  preserveOn: (pathname: string) => boolean
  onDiscard?: () => void
}

const containerTarget: ScrollTarget = {
  getScrollTop: () =>
    document.querySelector<HTMLElement>('.container')?.scrollTop,
  setScrollTop: (scrollTop) => {
    const element = document.querySelector<HTMLElement>('.container')
    if (!element) return false
    element.scrollTo({ top: scrollTop })
    return true
  },
}

/**
 * Owns the storage and router lifecycle for list scroll restoration.
 * Consumers only need to signal when their content is ready or invalidated.
 */
export class ScrollRestoration {
  private readonly getKey: () => string
  private readonly target: ScrollTarget
  private readonly preserveOn: (pathname: string) => boolean
  private readonly onDiscard?: () => void
  private unlisten?: () => void
  private restored = false
  private saveOnUnmount = true

  constructor({
    key,
    target = containerTarget,
    preserveOn,
    onDiscard,
  }: ScrollRestorationOptions) {
    this.getKey = typeof key === 'function' ? key : () => key
    this.target = target
    this.preserveOn = preserveOn
    this.onDiscard = onDiscard
  }

  mount(history: History) {
    this.unlisten = history.listen((location, action) => {
      if (action !== 'PUSH') return

      this.saveOnUnmount = this.preserveOn(location.pathname)
      if (this.saveOnUnmount) {
        this.save()
      } else {
        this.clear()
        this.onDiscard?.()
      }
    })
  }

  unmount() {
    this.unlisten?.()
    this.unlisten = undefined
    if (this.saveOnUnmount) this.save()
  }

  save() {
    const scrollTop = this.target.getScrollTop()
    if (scrollTop !== undefined) {
      try {
        sessionStorage.setItem(this.getKey(), scrollTop.toString())
      } catch {
        // sessionStorage may be unavailable (e.g. private browsing) or full
      }
    }
  }

  restore() {
    if (this.restored) return

    let saved: string | null
    try {
      saved = sessionStorage.getItem(this.getKey())
    } catch {
      this.restored = true
      return
    }

    if (saved === null) {
      this.restored = true
      return
    }

    const scrollTop = Number(saved)
    if (!Number.isFinite(scrollTop)) {
      this.clear()
      return
    }

    this.restored = this.target.setScrollTop(scrollTop)
  }

  invalidate(clearSavedPosition = false, key = this.getKey()) {
    this.restored = false
    if (clearSavedPosition) {
      try {
        sessionStorage.removeItem(key)
      } catch {
        // sessionStorage may be unavailable (e.g. private browsing)
      }
    }
  }

  clear(key = this.getKey()) {
    try {
      sessionStorage.removeItem(key)
    } catch {
      // sessionStorage may be unavailable (e.g. private browsing)
    }
    this.restored = false
  }
}
