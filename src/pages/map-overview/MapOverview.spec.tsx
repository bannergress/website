// @vitest-environment jsdom

import { act, createRef } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { LatLngBounds } from 'leaflet'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MapOverview, MapOverviewProps } from './MapOverview'
import { BannerFilter } from '../../features/banner/filter'

vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('antd', () => ({ Col: 'div', Row: 'div' }))
vi.mock('react-i18next', () => ({
  Trans: () => null,
  withTranslation: () => (component: unknown) => component,
}))
vi.mock('../../components/banners-map', () => ({
  default: ({ hasMoreBanners }: { hasMoreBanners: boolean }) => (
    <div data-limited={hasMoreBanners} />
  ),
}))
vi.mock('../../components/banner-list', () => ({ default: () => null }))
vi.mock('../../components/banners-accordion', () => ({ default: () => null }))
vi.mock('../../components/banner-order-chooser', () => ({
  default: () => null,
}))

describe('MapOverview banner limit warning', () => {
  let container: HTMLDivElement
  let root: Root
  const ref = createRef<MapOverview>()
  const fetchBanners = vi.fn<MapOverviewProps['fetchBanners']>()
  const bounds = new LatLngBounds([0, 0], [10, 20])
  const filter: BannerFilter = {
    orderBy: 'created',
    orderDirection: 'DESC',
    online: true,
  }

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    sessionStorage.clear()
    fetchBanners.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() =>
      root.render(
        <MapOverview
          ref={ref}
          getBanners={() => []}
          getBanner={() => undefined}
          mapBannersCount={100}
          fetchBanners={fetchBanners}
          fetchPreviewBanner={vi.fn()}
          resetBanners={vi.fn()}
          updateSettings={vi.fn()}
          defaultOnline
          location={{ pathname: '/map', search: '' }}
          history={{
            push: vi.fn(),
            replace: vi.fn(),
            goBack: vi.fn(),
            listen: () => () => {},
          }}
          match={{ params: {} }}
        />
      )
    )
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    sessionStorage.clear()
    vi.unstubAllGlobals()
  })

  const warningShown = () =>
    container.querySelector('[data-limited]')?.getAttribute('data-limited') ===
    'true'
  const load = () => ref.current!.onLoadBanners(bounds, filter)

  it('uses the current response rather than the accumulated banner count', async () => {
    expect(warningShown()).toBe(false)
    fetchBanners.mockResolvedValueOnce(true)
    await act(load)
    expect(warningShown()).toBe(true)

    fetchBanners.mockResolvedValueOnce(false)
    await act(load)
    expect(warningShown()).toBe(false)
  })

  it('hides the warning while loading and after a failed request', async () => {
    fetchBanners.mockResolvedValueOnce(true)
    await act(load)
    let reject!: (error: Error) => void
    fetchBanners.mockReturnValueOnce(
      new Promise((_, fail) => {
        reject = fail
      })
    )
    let pending!: Promise<void>
    act(() => {
      pending = load()
    })
    expect(warningShown()).toBe(false)

    await act(async () => {
      reject(new Error('Connection lost'))
      await pending
    })
    expect(warningShown()).toBe(false)
  })

  it('ignores an older response that finishes after the current request', async () => {
    let resolve!: (limited: boolean) => void
    fetchBanners.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done
      })
    )
    let pending!: Promise<void>
    act(() => {
      pending = load()
    })
    fetchBanners.mockResolvedValueOnce(false)
    await act(load)

    await act(async () => {
      resolve(true)
      await pending
    })
    expect(warningShown()).toBe(false)
  })

  it('makes a single request for the whole world when the view spans 360 degrees', async () => {
    fetchBanners.mockResolvedValueOnce(true)
    await act(() =>
      ref.current!.onLoadBanners(
        new LatLngBounds([-70, -200], [70, 200]),
        filter
      )
    )

    expect(fetchBanners).toHaveBeenCalledExactlyOnceWith(
      70,
      180,
      -70,
      -180,
      filter
    )
    expect(warningShown()).toBe(true)
  })
})
