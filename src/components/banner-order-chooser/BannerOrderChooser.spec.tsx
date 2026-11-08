// @vitest-environment jsdom
import { act, ReactNode, useState } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import BannerOrderChooser from './BannerOrderChooser'
import { BannerFilter } from '../../features/banner/filter'

vi.mock('antd', () => ({
  Modal: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div role="dialog">{children}</div> : null,
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({
    i18nKey,
    components,
  }: {
    i18nKey: string
    components?: { icon?: ReactNode }
  }) => (
    <>
      {i18nKey}
      {components?.icon}
    </>
  ),
}))

describe('filter and sort controls', () => {
  let container: HTMLDivElement
  let root: Root
  const onChange = vi.fn()
  const getCurrentPosition = vi.fn(
    (
      success: (position: {
        coords: { latitude: number; longitude: number }
      }) => void
    ) => {
      success({ coords: { latitude: 50, longitude: 10 } })
    }
  )

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    onChange.mockClear()
    getCurrentPosition.mockClear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  })

  function Filters({
    sorting = true,
    official = true,
  }: {
    sorting?: boolean
    official?: boolean
  }) {
    const [filter, setFilter] = useState<BannerFilter>({
      orderBy: 'created',
      orderDirection: 'DESC',
      online: true,
      onlyOfficialMissions: true,
    })
    return (
      <BannerOrderChooser
        filter={filter}
        includeOfficial={official}
        includeSorting={sorting}
        includeAddedList
        includeRelevance
        onFilterChanged={(value) => {
          onChange(value)
          setFilter(value)
        }}
      />
    )
  }

  const clickText = (text: string) => {
    const button = Array.from(container.querySelectorAll('button')).find(
      (node) => node.textContent === text
    )
    expect(button).toBeDefined()
    act(() => button!.click())
  }

  it('keeps flags independent and reverses the selected sorting direction', () => {
    act(() => root.render(<Filters />))
    clickText('order.filterAndSort')
    const switches =
      container.querySelectorAll<HTMLButtonElement>('[role="switch"]')
    expect(switches).toHaveLength(2)
    for (const control of switches) {
      expect(
        document.getElementById(control.getAttribute('aria-labelledby')!)
          ?.textContent
      ).toBeTruthy()
      expect(control.getAttribute('aria-checked')).toBe('false')
      expect(control.type).toBe('button')
    }
    act(() => switches[0].click())
    expect(switches[0].getAttribute('aria-checked')).toBe('true')
    expect(switches[0].textContent).toBe('buttons.on')
    expect(switches[1].getAttribute('aria-checked')).toBe('false')
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        online: undefined,
        onlyOfficialMissions: true,
        orderBy: 'created',
      })
    )
    act(() => switches[1].click())
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        online: undefined,
        onlyOfficialMissions: undefined,
      })
    )

    clickText('order.title')
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        orderBy: 'title',
        orderDirection: 'ASC',
        online: undefined,
        onlyOfficialMissions: undefined,
      })
    )
    clickText('order.title')
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ orderBy: 'title', orderDirection: 'DESC' })
    )
    expect(
      container.querySelector('.choice-buttons button[aria-pressed="true"]')
        ?.textContent
    ).toBe('order.title')
    expect(container.querySelector('.banner-order-inverse')).not.toBeNull()
    clickText('order.relevance')
    const calls = onChange.mock.calls.length
    clickText('order.relevance')
    expect(onChange).toHaveBeenCalledTimes(calls)
    clickText('order.proximityStartPoint')
    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        orderBy: 'proximityStartPoint',
        orderDirection: 'ASC',
        proximityLatitude: 50,
        proximityLongitude: 10,
      })
    )

    act(() => switches[0].click())
    act(() => switches[1].click())
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        online: true,
        onlyOfficialMissions: true,
        orderBy: 'proximityStartPoint',
      })
    )
  })

  it('keeps the filter-only variant free of sorting and hidden official controls', () => {
    act(() => root.render(<Filters sorting={false} official={false} />))
    clickText('order.filter')
    expect(container.querySelectorAll('[role="switch"]')).toHaveLength(1)
    expect(container.querySelector('.choice-buttons')).toBeNull()
  })
})
