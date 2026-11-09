// @vitest-environment jsdom
import React, { act, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Banner } from '../../features/banner/types'
import type { BannerInfoWithMapProps } from '../../components/banner-info-with-map/BannerInfoWithMap'
import { calculateCollectionOrder } from '../../features/banner/collectionOrderClient'
import { PreviewBanner, type PreviewBannerProps } from './PreviewBanner'
import i18n from '../../i18n'

vi.mock('../../api', () => ({ api: {} }))
vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  withTranslation:
    () =>
    <P extends object>(component: React.ComponentType<P>) =>
      component,
}))
vi.mock('antd', () => ({
  Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
  Button: ({
    children,
    loading,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
    loading?: boolean
  }) => (
    <button {...props} disabled={props.disabled || loading}>
      {children}
    </button>
  ),
}))
vi.mock('../../features/utils/os', () => ({ isMobile: () => false }))
vi.mock('../../features/banner/collectionOrderClient', () => ({
  calculateCollectionOrder: vi.fn(),
}))
vi.mock('../../components/loading-overlay', () => ({ default: () => null }))
vi.mock('../../components/navigation-prompt', () => ({
  NavigationPrompt: () => null,
}))
vi.mock('react-beforeunload', () => ({ Beforeunload: () => null }))
vi.mock('../../components/banner-info-with-map', () => ({
  BannerInfoWithMap: ({
    banner,
    mapControls,
    submitDisabled,
    showMissionOrder,
    onSubmitButtonClicked,
  }: BannerInfoWithMapProps) => (
    <div
      data-order={Object.keys(banner.missions ?? {})
        .map((key) => banner.missions![Number(key)].id)
        .join(',')}
      data-route={showMissionOrder}
    >
      {mapControls}
      <button
        data-submit
        disabled={submitDisabled}
        onClick={onSubmitButtonClicked}
      />
    </div>
  ),
}))

const banner: Banner = {
  id: '',
  title: 'Collection of 15 missions',
  type: 'anyOrder',
  numberOfMissions: 15,
  numberOfSubmittedMissions: 0,
  numberOfDisabledMissions: 0,
  startLatitude: 49.87,
  startLongitude: 8.65,
  missions: Object.fromEntries(
    Array.from({ length: 15 }, (_, index) => [
      index,
      {
        id: `mission-${index}`,
        title: `Mission ${index}`,
        picture: '',
        steps: [
          {
            poi: {
              id: `poi-${index}`,
              title: '',
              type: 'fieldTripWaypoint' as const,
              latitude: 49.87 + index * 0.001,
              longitude: 8.65,
            },
          },
        ],
      },
    ])
  ),
}

describe('collection optimization in preview', () => {
  let root: Root
  let container: HTMLDivElement
  let props: PreviewBannerProps
  const render = (value = banner) =>
    act(() => root.render(<PreviewBanner {...props} banner={value} />))
  const button = (mode: 'fast' | 'full') =>
    Array.from(container.querySelectorAll('button')).find(
      (element) => element.textContent === `banners.creation.order.${mode}`
    )!

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    container = document.createElement('div')
    root = createRoot(container)
    props = {
      banner,
      i18n,
      createBanner: vi.fn(() => Promise.resolve()),
      submitBanner: vi.fn(() => Promise.resolve('created')),
      removePendingBanner: vi.fn(),
      location: { pathname: '/preview-banner', search: '' },
      match: { params: {} },
      history: {
        push: vi.fn(),
        replace: vi.fn(),
        goBack: vi.fn(),
        listen: () => () => {},
      },
    }
    vi.mocked(calculateCollectionOrder).mockReset()
  })
  afterEach(() => {
    act(() => root.unmount())
    vi.unstubAllGlobals()
  })

  it.each(['fast', 'full'] as const)(
    'enables %s for 15 detailed missions and updates the preview order',
    async (mode) => {
      const order = Array.from({ length: 15 }, (_, index) => 14 - index)
      vi.mocked(calculateCollectionOrder).mockResolvedValue({
        order,
        exact: mode === 'full',
        beforeMeters: 10,
        afterMeters: 5,
        elapsedMilliseconds: 1,
      })
      render()
      expect(button('fast').disabled).toBe(false)
      expect(button('full').disabled).toBe(false)
      await act(() => {
        button(mode).click()
        return Promise.resolve()
      })
      const reordered: Banner = {
        ...banner,
        missions: Object.fromEntries(
          order.map((old, index) => [index, banner.missions![old]])
        ),
      }
      expect(props.createBanner).toHaveBeenCalledWith(
        reordered,
        expect.any(AbortSignal)
      )
      render(reordered)
      expect(
        container.querySelector('[data-order]')?.getAttribute('data-order')
      ).toBe(
        Object.keys(reordered.missions!)
          .map((key) => reordered.missions![Number(key)].id)
          .join(',')
      )
      expect(
        container.querySelector('[data-route]')?.getAttribute('data-route')
      ).toBe('true')
      expect(container.textContent).not.toContain(
        'banners.creation.order.result'
      )
    }
  )

  it('keeps the calculation running across state changes and blocks submitting until it finishes', async () => {
    let complete!: (
      result: Awaited<ReturnType<typeof calculateCollectionOrder>>
    ) => void
    vi.mocked(calculateCollectionOrder).mockImplementation(
      (_missions, signal) => {
        expect(signal.aborted).toBe(false)
        return new Promise((resolve) => {
          complete = resolve
        })
      }
    )
    render()
    await act(() => {
      button('fast').click()
      return Promise.resolve()
    })
    expect(
      container.querySelector<HTMLButtonElement>('[data-submit]')!.disabled
    ).toBe(true)
    const signal = vi.mocked(calculateCollectionOrder).mock.calls[0][1]
    expect(signal.aborted).toBe(false)
    await act(() => {
      complete({
        order: Array.from({ length: 15 }, (_, index) => index),
        exact: false,
        beforeMeters: 10,
        afterMeters: 5,
        elapsedMilliseconds: 1,
      })
      return Promise.resolve()
    })
    expect(
      container.querySelector<HTMLButtonElement>('[data-submit]')!.disabled
    ).toBe(false)
  })

  it('does not offer optimization for a sequential banner', () => {
    render({ ...banner, type: 'sequential' })
    expect(container.querySelectorAll('button')).toHaveLength(1)
  })
})
