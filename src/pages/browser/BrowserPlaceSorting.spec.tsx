// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Browser, BrowserProps } from './Browser'
import { Place } from '../../features/place/types'
import i18n from '../../i18n'

vi.mock('../../api', () => ({ api: {} }))
vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
  Trans: () => null,
}))
vi.mock('../../components/banner-list', () => ({ default: () => null }))
vi.mock('../../components/banner-order-chooser', () => ({
  default: () => null,
}))
vi.mock('../../components/footer-main', () => ({ default: () => null }))
vi.mock('../../components/loading-overlay', () => ({ default: () => null }))

const place = (
  id: string,
  numberOfBanners: number,
  type: Place['type'] = 'country'
): Place => ({
  id,
  longName: id,
  shortName: 'DE',
  formattedAddress: id,
  numberOfBanners,
  type,
  boundaryMinLatitude: 0,
  boundaryMinLongitude: 0,
  boundaryMaxLatitude: 1,
  boundaryMaxLongitude: 1,
})

const countries = [place('Germany', 20), place('Austria', 10)]
const regions = [
  {
    ...place('Zürich', 20, 'administrative_area_level_1'),
    parentPlaceId: 'Germany',
  },
  { ...place('Aachen', 10, 'locality'), parentPlaceId: 'Germany' },
]
const cities = [
  place('Winterthur', 20, 'locality'),
  place('Baden', 10, 'locality'),
]
const administrativeAreas: Record<string, Place[]> = {
  Germany: regions,
  Zürich: cities,
}
const store = configureStore({
  reducer: {
    place: () => ({ countries, administrativeAreas }),
  },
})

describe('Browse place sorting', () => {
  let container: HTMLDivElement
  let root: Root
  let props: BrowserProps

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    localStorage.clear()
    sessionStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    props = {
      defaultOrderBy: 'created',
      defaultOrderDirection: 'DESC',
      defaultOnline: true,
      defaultProximityLatitude: undefined,
      defaultProximityLongitude: undefined,
      banners: [],
      countries,
      hasMore: true,
      getAdministrativeAreas: (id) => administrativeAreas[id] ?? [],
      getPlace: (id) =>
        [...countries, ...regions].find((p) => p.id === id) ?? null,
      fetchCountries: vi.fn().mockResolvedValue(undefined),
      fetchAdministrativeAreas: vi.fn().mockResolvedValue(undefined),
      fetchPlace: vi.fn().mockResolvedValue(undefined),
      fetchBanners: vi.fn().mockResolvedValue(undefined),
      updateSettings: vi.fn(),
      resetBrowsedBanners: vi.fn(),
      location: { pathname: '/browse', search: '' },
      history: {
        push: vi.fn(),
        replace: vi.fn(),
        goBack: vi.fn(),
        listen: () => vi.fn(),
      },
      match: { params: { placeId: '' } },
      i18n,
    }
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  })

  const render = async () => {
    await act(async () => {
      root.render(
        <Provider store={store}>
          <MemoryRouter>
            <Browser {...props} />
          </MemoryRouter>
        </Provider>
      )
      await Promise.resolve()
    })
  }

  const click = (selector: string) => {
    const button = container.querySelector<HTMLButtonElement>(selector)
    expect(button).not.toBeNull()
    act(() => button!.click())
  }

  const desktopNames = () =>
    Array.from(
      container.querySelectorAll('.places-list-child .place-name')
    ).map((element) => element.textContent)
  const mobileNames = () =>
    Array.from(
      container.querySelectorAll('.place-accordion-entry .place-name')
    ).map((element) => element.textContent)

  it('shares the choice between desktop and mobile and remembers it on remount', async () => {
    await render()
    expect(desktopNames()).toEqual(['Germany', 'Austria'])
    expect(
      container.querySelector('.place-accordion .place-order-chooser')
    ).toBeNull()
    click('.place-accordion-title')
    expect(mobileNames()).toEqual(['Germany', 'Austria'])

    const fetchCount = vi.mocked(props.fetchBanners).mock.calls.length
    click('.places-list .place-order-chooser button:first-child')
    expect(desktopNames()).toEqual(['Austria', 'Germany'])
    expect(mobileNames()).toEqual(['Austria', 'Germany'])
    expect(
      container.querySelector('.place-accordion-entry')?.className
    ).toContain('place-accordion-entry-all')
    expect(
      container
        .querySelector('.place-accordion .place-order-chooser button')
        ?.getAttribute('aria-pressed')
    ).toBe('true')
    expect(vi.mocked(props.fetchBanners).mock.calls).toHaveLength(fetchCount)
    expect(props.updateSettings).not.toHaveBeenCalled()

    act(() => root.unmount())
    root = createRoot(container)
    await render()
    expect(desktopNames()).toEqual(['Austria', 'Germany'])

    props = { ...props, match: { params: { placeId: 'Germany' } } }
    await render()
    expect(desktopNames()).toEqual(['Aachen', 'Zürich'])
    click('.place-accordion-page:nth-child(2) .place-accordion-title')
    click('.place-accordion .place-order-chooser button:last-child')
    expect(desktopNames()).toEqual(['Zürich', 'Aachen'])
    expect(mobileNames()).toEqual(['Zürich', 'Aachen'])
    click('.place-accordion-page:first-child .place-accordion-title')
    expect(mobileNames()).toEqual(['Austria', 'Germany'])
  })

  it('defaults to alphabetical regions while the country accordion keeps count order', async () => {
    props = { ...props, match: { params: { placeId: 'Germany' } } }
    await render()
    expect(desktopNames()).toEqual(['Aachen', 'Zürich'])
    click('.place-accordion-page:nth-child(2) .place-accordion-title')
    expect(mobileNames()).toEqual(['Aachen', 'Zürich'])
    click('.place-accordion-page:first-child .place-accordion-title')
    expect(mobileNames()).toEqual(['Germany', 'Austria'])
  })

  it('keeps each hierarchy level independent when editing ancestors and after remount', async () => {
    await render()
    click('.places-list .place-order-chooser button:first-child')

    props = { ...props, match: { params: { placeId: 'Germany' } } }
    await render()
    expect(desktopNames()).toEqual(['Aachen', 'Zürich'])
    click('.places-list .place-order-chooser button:last-child')

    props = { ...props, match: { params: { placeId: 'Zürich' } } }
    await render()
    expect(desktopNames()).toEqual(['Baden', 'Winterthur'])

    click('.place-accordion-page:first-child .place-accordion-title')
    expect(mobileNames()).toEqual(['Austria', 'Germany'])
    click('.place-accordion .place-order-chooser button:last-child')
    expect(mobileNames()).toEqual(['Germany', 'Austria'])
    expect(desktopNames()).toEqual(['Baden', 'Winterthur'])

    click('.place-accordion-page:nth-child(2) .place-accordion-title')
    expect(mobileNames()).toEqual(['Zürich', 'Aachen'])
    click('.place-accordion .place-order-chooser button:first-child')
    expect(mobileNames()).toEqual(['Aachen', 'Zürich'])
    expect(desktopNames()).toEqual(['Baden', 'Winterthur'])

    click('.place-accordion-page:nth-child(3) .place-accordion-title')
    click('.place-accordion .place-order-chooser button:last-child')
    expect(desktopNames()).toEqual(['Winterthur', 'Baden'])

    act(() => root.unmount())
    root = createRoot(container)
    await render()
    expect(desktopNames()).toEqual(['Winterthur', 'Baden'])
    click('.place-accordion-page:nth-child(2) .place-accordion-title')
    expect(mobileNames()).toEqual(['Aachen', 'Zürich'])
    click('.place-accordion-page:first-child .place-accordion-title')
    expect(mobileNames()).toEqual(['Germany', 'Austria'])
  })
})
