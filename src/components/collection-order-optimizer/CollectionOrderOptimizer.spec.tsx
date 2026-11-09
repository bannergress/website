// @vitest-environment jsdom
import { act, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mission } from '../../features/mission/types'
import type { CollectionOrderResult } from '../../features/banner/collectionOrder'
import { calculateCollectionOrder } from '../../features/banner/collectionOrderClient'
import { CollectionOrderOptimizer } from './CollectionOrderOptimizer'
import { isMobile } from '../../features/utils/os'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('antd', () => ({
  Tooltip: ({ title, children }: { title: string; children: ReactNode }) => (
    <span title={title}>{children}</span>
  ),
  Button: ({
    loading,
    children,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean
    children: ReactNode
  }) => (
    <button {...props} disabled={props.disabled || loading}>
      {children}
    </button>
  ),
}))
vi.mock('../../features/utils/os', () => ({ isMobile: vi.fn() }))
vi.mock('../../features/banner/collectionOrderClient', () => ({
  calculateCollectionOrder: vi.fn(),
}))

const missions: Mission[] = [0, 1].map((index) => ({
  id: String(index),
  title: `Mission ${index}`,
  picture: '',
  steps: [
    {
      poi: {
        id: String(index),
        title: '',
        type: 'fieldTripWaypoint',
        latitude: 0,
        longitude: index,
      },
    },
  ],
}))
const result: CollectionOrderResult = {
  order: [1, 0],
  exact: true,
  beforeMeters: 10,
  afterMeters: 5,
  elapsedMilliseconds: 1,
}

describe('collection optimizer controls', () => {
  let container: HTMLDivElement
  let root: Root
  const onOrdered = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    container = document.createElement('div')
    root = createRoot(container)
    onOrdered.mockReset()
    vi.mocked(calculateCollectionOrder).mockReset()
    vi.mocked(isMobile).mockReturnValue(false)
  })
  afterEach(() => {
    act(() => root.unmount())
    vi.unstubAllGlobals()
  })

  const render = (values = missions, disabled = false) =>
    act(() =>
      root.render(
        <CollectionOrderOptimizer
          missions={values}
          disabled={disabled}
          onOrdered={onOrdered}
        />
      )
    )
  const optimizeButton = () => container.querySelector('button')!

  it('applies the result without extra labels or descriptions', async () => {
    vi.mocked(calculateCollectionOrder).mockResolvedValue(result)
    render()
    await act(() => {
      optimizeButton().click()
      return Promise.resolve()
    })
    expect(onOrdered).toHaveBeenCalledWith(
      [missions[1], missions[0]],
      expect.any(AbortSignal)
    )
    render([missions[1], missions[0]])
    expect(container.querySelectorAll('p')).toHaveLength(0)
    render([missions[0]])
    expect(container.textContent).not.toContain('banners.creation.order.result')
  })

  it('disables calculation for filler missions and while saving', () => {
    render([...missions, { id: 'placeholder-1', title: '', picture: '' }])
    expect(optimizeButton().disabled).toBe(true)
    render(missions, true)
    expect(optimizeButton().disabled).toBe(true)
  })

  it('reports unavailable waypoint coordinates when calculation is requested', async () => {
    render([...missions, { id: 'missing', title: '', picture: '' }])
    expect(optimizeButton().disabled).toBe(false)
    await act(() => {
      optimizeButton().click()
      return Promise.resolve()
    })
    expect(container.textContent).toContain(
      'banners.creation.order.missingCoordinates'
    )
    expect(calculateCollectionOrder).not.toHaveBeenCalled()
  })

  it.each(['cancel', 'change', 'disable', 'unmount'] as const)(
    'ignores a stale result after %s',
    async (action) => {
      let complete!: (value: CollectionOrderResult) => void
      let signal!: AbortSignal
      vi.mocked(calculateCollectionOrder).mockImplementation(
        (_values, abortSignal) => {
          signal = abortSignal
          return new Promise((resolve) => {
            complete = resolve
          })
        }
      )
      render()
      await act(() => {
        optimizeButton().click()
        return Promise.resolve()
      })
      expect(signal.aborted).toBe(false)
      if (action === 'cancel')
        act(() =>
          Array.from(container.querySelectorAll('button'))
            .find(
              (button) => button.textContent === 'banners.creation.order.cancel'
            )!
            .click()
        )
      if (action === 'change') render([...missions])
      if (action === 'disable') render(missions, true)
      if (action === 'unmount') act(() => root.render(null))
      expect(signal.aborted).toBe(true)
      await act(() => {
        complete(result)
        return Promise.resolve()
      })
      expect(onOrdered).not.toHaveBeenCalled()
    }
  )

  it('shows a failure and allows retrying without changing the missions', async () => {
    vi.mocked(calculateCollectionOrder).mockRejectedValue(
      new Error('Worker failed')
    )
    render()
    await act(() => {
      optimizeButton().click()
      return Promise.resolve()
    })
    expect(container.textContent).toContain('banners.creation.order.error')
    expect(optimizeButton().disabled).toBe(false)
    expect(onOrdered).not.toHaveBeenCalled()
  })

  it('offers only fast search on mobile, even for a small collection', async () => {
    vi.mocked(isMobile).mockReturnValue(true)
    vi.mocked(calculateCollectionOrder).mockResolvedValue({
      ...result,
      exact: false,
    })
    render()
    expect(container.querySelectorAll('button')).toHaveLength(1)
    expect(container.textContent).not.toContain('banners.creation.order.full')
    await act(() => {
      optimizeButton().click()
      return Promise.resolve()
    })
    expect(calculateCollectionOrder).toHaveBeenCalledWith(
      missions,
      expect.any(AbortSignal),
      'fast'
    )
  })

  it('offers full search on desktop with a resource tooltip', async () => {
    vi.mocked(calculateCollectionOrder).mockResolvedValue(result)
    render()
    expect(container.querySelector('[title]')?.getAttribute('title')).toBe(
      'banners.creation.order.fullWarning'
    )
    await act(() => {
      container.querySelectorAll('button')[1].click()
      return Promise.resolve()
    })
    expect(calculateCollectionOrder).toHaveBeenCalledWith(
      missions,
      expect.any(AbortSignal),
      'full'
    )
  })

  it('allows full search at 24 but disables it above 24 while keeping fast search', () => {
    const values = Array.from({ length: 24 }, (_, i) => ({
      ...missions[0],
      id: String(i),
    }))
    render(values)
    expect(container.querySelectorAll('button')[1].disabled).toBe(false)
    render([...values, { ...missions[0], id: '25' }])
    expect(optimizeButton().disabled).toBe(false)
    expect(container.querySelectorAll('button')[1].disabled).toBe(true)
    expect(container.querySelector('[title]')?.getAttribute('title')).toBe(
      'banners.creation.order.fullLimit'
    )
  })
})
