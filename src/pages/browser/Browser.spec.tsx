import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Browser, BrowserProps } from './Browser'

vi.mock('../../api', () => ({ api: {} }))
vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))

describe('Browse scroll restoration', () => {
  afterEach(() => vi.unstubAllGlobals())

  beforeEach(() => {
    const storage = new Map<string, string>()
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    })
  })

  it.each([undefined, 'country-id'])(
    'restores cached banners after place data loads for %s',
    async (placeId) => {
      sessionStorage.setItem('browseScrollPosition', '900')
      let contentHeight = 400
      const container = {
        scrollTop: 0,
        scrollTo: vi.fn(({ top }: { top: number }) => {
          container.scrollTop = Math.min(top, contentHeight - 400)
        }),
      }
      vi.stubGlobal('document', { querySelector: () => container })

      const refetchPlaces = vi.fn(() => {
        // Redux dispatches the refreshed places before loadInitialData finishes.
        // Cached banners remain present while Browser renders its loading view.
        browser.componentDidUpdate()
        expect(container.scrollTo).not.toHaveBeenCalled()
        return Promise.resolve()
      })
      const props: BrowserProps = {
        defaultOrderBy: 'created',
        defaultOrderDirection: 'DESC',
        defaultOnline: true,
        defaultProximityLatitude: undefined,
        defaultProximityLongitude: undefined,
        banners: [
          {
            id: 'cached-banner',
            title: 'Cached banner',
            numberOfMissions: 6,
            numberOfSubmittedMissions: 0,
            numberOfDisabledMissions: 0,
            startLatitude: 50,
            startLongitude: 10,
          },
        ],
        countries: [],
        hasMore: false,
        getAdministrativeAreas: () => [],
        getPlace: () => null,
        fetchCountries: refetchPlaces,
        fetchAdministrativeAreas: refetchPlaces,
        fetchPlace: refetchPlaces,
        fetchBanners: vi.fn(),
        updateSettings: vi.fn(),
        resetBrowsedBanners: vi.fn(),
        location: { pathname: '/browse', search: '' },
        history: {
          push: vi.fn(),
          replace: vi.fn(),
          goBack: vi.fn(),
          listen: () => vi.fn(),
        },
        match: { params: { placeId: placeId ?? '' } },
      }
      const browser = new Browser(props)
      vi.spyOn(browser, 'setState').mockImplementation((update) => {
        browser.state = {
          ...browser.state,
          ...(typeof update === 'function'
            ? update(browser.state, browser.props)
            : update),
        }
        if (browser.state.status === 'success') contentHeight = 4000
        browser.componentDidUpdate()
      })

      await browser.loadInitialData()

      expect(refetchPlaces).toHaveBeenCalledTimes(placeId ? 2 : 1)
      expect(props.fetchBanners).not.toHaveBeenCalled()
      expect(container.scrollTop).toBe(900)
      expect(container.scrollTo).toHaveBeenCalledExactlyOnceWith({ top: 900 })
      browser.componentWillUnmount()
    }
  )
})
