import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ScrollRestoration, ScrollRestorationHistory, ScrollTarget } from '.'

type Location = { pathname: string }
type Action = string

const createStorage = (): Storage => {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  }
}

const createHistory = () => {
  let listener: ((location: Location, action: Action) => void) | undefined
  const unlisten = vi.fn()
  const history: ScrollRestorationHistory = {
    listen: vi.fn((nextListener) => {
      listener = nextListener
      return unlisten
    }),
  }

  return {
    history,
    navigate: (pathname: string, action: Action = 'PUSH') =>
      listener?.({ pathname } as Location, action),
    unlisten,
  }
}

describe('ScrollRestoration', () => {
  beforeEach(() => {
    vi.stubGlobal('sessionStorage', createStorage())
  })

  it('saves before navigating to a preserved route and restores once', () => {
    const { history, navigate } = createHistory()
    const setScrollTop = vi.fn(() => true)
    const target: ScrollTarget = {
      getScrollTop: () => 240,
      setScrollTop,
    }
    const restoration = new ScrollRestoration({
      key: 'list-scroll',
      target,
      preserveOn: (pathname) => pathname.startsWith('/banner/'),
    })

    restoration.mount(history)
    navigate('/banner/123')
    expect(sessionStorage.getItem('list-scroll')).toBe('240')

    restoration.restore()
    restoration.restore()
    expect(setScrollTop).toHaveBeenCalledOnce()
    expect(setScrollTop).toHaveBeenCalledWith(240)
  })

  it('discards a position without saving it again during unmount', () => {
    const { history, navigate, unlisten } = createHistory()
    const onDiscard = vi.fn()
    sessionStorage.setItem('list-scroll', '100')
    const restoration = new ScrollRestoration({
      key: 'list-scroll',
      target: { getScrollTop: () => 300, setScrollTop: () => true },
      preserveOn: (pathname) => pathname.startsWith('/banner/'),
      onDiscard,
    })

    restoration.mount(history)
    navigate('/search')
    restoration.unmount()

    expect(sessionStorage.getItem('list-scroll')).toBeNull()
    expect(onDiscard).toHaveBeenCalledOnce()
    expect(unlisten).toHaveBeenCalledOnce()
  })

  it('supports keys that change with the displayed list', () => {
    let list = 'created'
    const setScrollTop = vi.fn(() => true)
    const restoration = new ScrollRestoration({
      key: () => `list-scroll:${list}`,
      target: { getScrollTop: () => 0, setScrollTop },
      preserveOn: () => true,
    })
    sessionStorage.setItem('list-scroll:created', '10')
    sessionStorage.setItem('list-scroll:done', '20')

    restoration.restore()
    list = 'done'
    restoration.invalidate()
    restoration.restore()

    expect(setScrollTop).toHaveBeenNthCalledWith(1, 10)
    expect(setScrollTop).toHaveBeenNthCalledWith(2, 20)
  })
})
