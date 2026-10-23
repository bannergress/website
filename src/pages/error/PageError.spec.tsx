// @vitest-environment jsdom

import { act, useLayoutEffect } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import {
  createMemoryRouter,
  Link,
  Outlet,
  RouterProvider,
} from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import translation from '../../locales/en/translation.json'
import PageError from './PageError'

const failure = new Error('Private diagnostic details')
const healthyPage = 'Healthy page'
const unreachablePage = 'Unreachable page'
const BrokenPage = (): never => {
  throw failure
}
const BrokenEffect = () => {
  useLayoutEffect(() => {
    throw failure
  }, [])
  return null
}
const Shell = () => (
  <>
    <nav>
      <Link to="/">{translation.error.unexpected.home}</Link>
    </nav>
    <Outlet />
  </>
)

describe('PageError route boundaries', () => {
  let container: HTMLDivElement
  let root: Root
  let router: ReturnType<typeof createMemoryRouter>
  const i18n = createInstance()

  beforeEach(async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    await i18n.init({
      lng: 'en',
      resources: { en: { translation } },
      interpolation: { escapeValue: false },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    router.dispose()
    container.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  const renderRoute = async (path: string, brokenShell = false) => {
    router = createMemoryRouter(
      [
        {
          element: brokenShell ? <BrokenPage /> : <Shell />,
          ErrorBoundary: PageError,
          children: [
            {
              ErrorBoundary: PageError,
              children: [
                { index: true, element: <p>{healthyPage}</p> },
                { path: 'render-error', element: <BrokenPage /> },
                { path: 'effect-error', element: <BrokenEffect /> },
                {
                  path: 'loader-error',
                  loader: () => Promise.reject(failure),
                  element: <p>{unreachablePage}</p>,
                },
              ],
            },
          ],
        },
      ],
      { initialEntries: [path] }
    )
    await act(() =>
      Promise.resolve(
        root.render(
          <I18nextProvider i18n={i18n}>
            <RouterProvider router={router} />
          </I18nextProvider>
        )
      )
    )
  }

  it.each(['/render-error', '/effect-error', '/loader-error'])(
    'shows a translated error with recovery actions and preserves navigation for %s',
    async (path) => {
      await renderRoute(path)

      expect(container.querySelector('nav')).not.toBeNull()
      expect(container.querySelector('h1')?.textContent).toBe(
        translation.error.unexpected.title
      )
      expect(container.querySelector('[role="alert"]')?.textContent).toBe(
        translation.error.unexpected.description
      )
      expect(container.querySelector('button')?.textContent).toBe(
        translation.error.unexpected.reload
      )
      expect(container.textContent).not.toContain(failure.message)

      const home = container.querySelector<HTMLAnchorElement>(
        '.page-error__actions a'
      )!
      expect(home.getAttribute('href')).toBe('/')
      act(() => home.click())
      expect(container.textContent).toContain(healthyPage)
      expect(container.querySelector('[role="alert"]')).toBeNull()

      await act(() => router.navigate('/render-error'))
      expect(container.querySelector('[role="alert"]')).not.toBeNull()
    }
  )

  it('catches a failure in the surrounding layout at the root boundary', async () => {
    await renderRoute('/', true)
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      translation.error.unexpected.description
    )
    expect(container.textContent).not.toContain(failure.message)
  })
})
