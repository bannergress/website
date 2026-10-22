import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import BannerList from './BannerList'
import { Banner } from '../../features/banner/types'
import reducer from '../../features/banner/reducer'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'

vi.mock('../../api', () => ({ api: {} }))
vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('../../hooks/UserLoggedIn', () => ({ useUserLoggedIn: vi.fn() }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}))
vi.mock('../banner-card', () => ({
  default: ({ banner }: { banner: Banner }) => <div>{banner.title}</div>,
}))

const banner: Banner = {
  id: 'banner-id',
  title: 'Test banner',
  numberOfMissions: 6,
  numberOfSubmittedMissions: 0,
  numberOfDisabledMissions: 0,
  startLatitude: 0,
  startLongitude: 0,
  listType: 'todo',
}

const renderList = (banners: Banner[] = [banner], hasMoreBanners = false) =>
  renderToStaticMarkup(
    <Provider store={configureStore({ reducer: { banner: reducer } })}>
      <MemoryRouter>
        <BannerList
          banners={banners}
          hasMoreBanners={hasMoreBanners}
          applyBannerListStyles
          hideBlacklisted={false}
          showDetailsButton={false}
        />
      </MemoryRouter>
    </Provider>
  )

describe('list controls on banner cards', () => {
  it('keeps the pagination sentinel when all loaded cards leave the list', () => {
    vi.mocked(useUserLoggedIn).mockReturnValue({
      initialized: true,
      authenticated: true,
    })
    const html = renderList([], true)
    expect(html).toContain('class="banner-list"')
    expect(html).toContain('loadingMore')
    expect(html).not.toContain('banner-list-menu')
  })

  it('keeps list actions in a single closed button outside the navigation link', () => {
    vi.mocked(useUserLoggedIn).mockReturnValue({
      initialized: true,
      authenticated: true,
    })
    const html = renderList()
    expect(html).toContain('href="/banner/banner-id"')
    expect(html.indexOf('</a>')).toBeLessThan(html.indexOf('banner-list-menu'))
    expect(html).toContain('banner-list-menu-todo')
    expect(html).toContain('aria-expanded="false"')
    expect(html).not.toContain('banner-list-type-control')
    expect(html.match(/type="button"/g)).toHaveLength(1)
  })

  it.each([false, true])(
    'hides controls for unauthenticated users (initialized: %s)',
    (initialized) => {
      vi.mocked(useUserLoggedIn).mockReturnValue({
        initialized,
        authenticated: false,
      })
      const html = renderList()
      expect(html).toContain('href="/banner/banner-id"')
      expect(html).not.toContain('banner-list-menu')
    }
  )
})
