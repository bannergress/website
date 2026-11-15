// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BannerFilter } from '../../features/banner/filter'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'
import BannerOrderChooser from './BannerOrderChooser'

vi.mock('../../hooks/UserLoggedIn', () => ({ useUserLoggedIn: vi.fn() }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: () => null,
}))
vi.mock('antd', () => ({
  Modal: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div role="dialog">{children}</div> : null,
  Switch: ({
    checked,
    onChange,
    'aria-label': label,
  }: {
    checked: boolean
    onChange: (checked: boolean) => void
    'aria-label'?: string
  }) => (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  ),
}))

describe('banner list exclusions', () => {
  let container: HTMLDivElement
  let root: Root
  const onFilterChanged = vi.fn<(filter: BannerFilter) => void>()
  const initialFilter: BannerFilter = {
    orderBy: 'lengthMeters',
    orderDirection: 'ASC',
    online: true,
    onlyOfficialMissions: true,
  }

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.mocked(useUserLoggedIn).mockReturnValue({
      authenticated: true,
      initialized: true,
    })
    container = document.createElement('div')
    root = createRoot(container)
    onFilterChanged.mockReset()
  })

  afterEach(() => {
    act(() => root.unmount())
    vi.unstubAllGlobals()
  })

  const render = (filter = initialFilter, includeAddedList = false) =>
    act(() =>
      root.render(
        <BannerOrderChooser
          filter={filter}
          onFilterChanged={onFilterChanged}
          includeAddedList={includeAddedList}
        />
      )
    )

  const open = () => act(() => container.querySelector('button')!.click())
  const checkbox = (type: 'Done' | 'Todo') =>
    container.querySelector<HTMLInputElement>(
      `[aria-label="order.show${type}"]`
    )!

  it('defaults on, combines exclusions independently, and restores all lists', () => {
    render()
    open()
    expect(checkbox('Done').checked).toBe(true)
    expect(checkbox('Todo').checked).toBe(true)

    const toggle = (
      type: 'Done' | 'Todo',
      listTypes: BannerFilter['listTypes']
    ) => {
      act(() => checkbox(type).click())
      const expected = { ...initialFilter, listTypes }
      expect(onFilterChanged).toHaveBeenLastCalledWith(expected)
      render(expected)
    }

    toggle('Done', ['none', 'todo', 'blacklist'])
    expect(checkbox('Done').checked).toBe(false)
    expect(checkbox('Todo').checked).toBe(true)
    toggle('Todo', ['none', 'blacklist'])
    expect(checkbox('Done').checked).toBe(false)
    expect(checkbox('Todo').checked).toBe(false)
    toggle('Done', ['none', 'done', 'blacklist'])
    expect(checkbox('Todo').checked).toBe(false)
    toggle('Todo', undefined)
    expect(checkbox('Done').checked).toBe(true)
    expect(checkbox('Todo').checked).toBe(true)
  })

  it('does not offer personal filters to guests', () => {
    vi.mocked(useUserLoggedIn).mockReturnValue({
      authenticated: false,
      initialized: true,
    })
    render()
    open()
    expect(checkbox('Done')).toBeNull()
    expect(checkbox('Todo')).toBeNull()
  })

  it('preserves dedicated lists and their list-added sorting', () => {
    render({ ...initialFilter, listTypes: 'todo', orderBy: 'listAdded' }, true)
    open()
    expect(checkbox('Done')).toBeNull()
    expect(checkbox('Todo')).toBeNull()
    expect(onFilterChanged).not.toHaveBeenCalled()
  })
})
