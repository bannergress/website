// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import type { BannerFilter } from '../../features/banner/filter'
import en from '../../locales/en/translation.json'
import BannerOrderChooser from './BannerOrderChooser'

vi.mock('antd', () => ({
  Switch: () => null,
  Modal: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div role="dialog">{children}</div> : null,
}))

describe('efficiency sorting', () => {
  let container: HTMLDivElement
  let root: Root
  const i18n = createInstance()
  const onFilterChanged = vi.fn<(filter: BannerFilter) => void>()
  const filter: BannerFilter = {
    orderBy: 'proximityStartPoint',
    orderDirection: 'ASC',
    online: true,
    onlyOfficialMissions: true,
    proximityLatitude: 52,
    proximityLongitude: 13,
  }

  beforeEach(async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    container = document.createElement('div')
    root = createRoot(container)
    onFilterChanged.mockReset()
    await i18n.init({
      lng: 'en',
      resources: {
        en: { translation: en },
      },
    })
  })

  afterEach(() => {
    act(() => root.unmount())
    vi.unstubAllGlobals()
  })

  const render = (value: BannerFilter) =>
    act(() =>
      root.render(
        <I18nextProvider i18n={i18n}>
          <BannerOrderChooser
            filter={value}
            onFilterChanged={onFilterChanged}
          />
        </I18nextProvider>
      )
    )

  it('selects most efficient first and toggles direction', () => {
    render(filter)
    act(() => container.querySelector('button')!.click())
    const button = Array.from(container.querySelectorAll('button')).find(
      (item) => item.textContent?.includes('Efficiency')
    )!
    act(() => button.click())
    const selected: BannerFilter = {
      ...filter,
      orderBy: 'efficiency',
      orderDirection: 'DESC',
      proximityLatitude: undefined,
      proximityLongitude: undefined,
    }
    expect(onFilterChanged).toHaveBeenLastCalledWith(selected)
    render(selected)
    expect(button.classList.contains('selected')).toBe(true)
    expect(button.querySelector('.banner-order-inverse')).not.toBeNull()
    act(() => button.click())
    expect(onFilterChanged).toHaveBeenLastCalledWith({
      ...selected,
      orderDirection: 'ASC',
    })
  })
})
