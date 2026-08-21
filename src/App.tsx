/* eslint-disable i18next/no-literal-string */
import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useMatch,
} from 'react-router-dom'
import { Layout } from 'antd'
import { Helmet } from 'react-helmet'
import { ReactKeycloakProvider } from '@react-keycloak/web'

import { useHotkeys } from 'react-hotkeys-hook'
import keycloak from './keycloak'

import { updateApiState } from './api'
import patchDOMForGoogleTranslate from './features/utils/patchGoogleTranslate'
import { Home } from './pages/Home'
import { MapOverview } from './pages/map-overview'
import { BannerInfo } from './pages/banner-info'
import { Search } from './pages/search'
import { Agent } from './pages/agent'
import { UserBannerList } from './pages/user-banner-list'
import { Browser } from './pages/browser'
import { CreateBanner } from './pages/create-banner'
import { PreviewBanner } from './pages/preview-banner'
import { PrivateRoute } from './components/login/private-route'
import { Help } from './pages/help'
import { Error } from './pages/error'
import { Account } from './pages/account'
import MenuMain from './components/menu-main'
import Navbar from './components/navbar'

import './i18n'
import './App.less'
import Events from './pages/events/Events'

const useHideNavbarOnMobile = () => {
  // The Navbar should be hidden in mobile mode but only on some pages.
  const bannerMatch = useMatch('/banner/:id')
  const previewMatch = useMatch('/preview-banner')
  return Boolean(bannerMatch || previewMatch)
}

const Root: React.FC = () => {
  const hideOnMobile = useHideNavbarOnMobile()

  return (
    <>
      <Navbar className={hideOnMobile ? 'hide-on-mobile' : undefined} />
      <Layout className="main">
        <div className="container">
          <Outlet />
        </div>
      </Layout>
      <div className="bottom-menu">
        <MenuMain />
      </div>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'map', element: <MapOverview /> },
      { path: 'events', element: <Events /> },
      { path: 'browse', element: <Browser /> },
      { path: 'browse/:placeId', element: <Browser /> },
      { path: 'banner/:id', element: <BannerInfo /> },
      { path: 'search/:term', element: <Search /> },
      { path: 'agent/:agentName', element: <Agent /> },
      { path: 'user/banners/:listType', element: <UserBannerList /> },
      {
        path: 'user/banners',
        element: <Navigate to="/user/banners/todo" replace />,
      },
      { path: 'help', element: <Help /> },
      { path: 'error', element: <Error /> },
      { path: 'new-banner', element: <CreateBanner /> },
      {
        path: 'edit-banner/:id',
        element: (
          <PrivateRoute component={CreateBanner} adminRoles="manage-banners" />
        ),
      },
      {
        path: 'preview-banner',
        element: <PrivateRoute component={PreviewBanner} />,
      },
      { path: 'account', element: <PrivateRoute component={Account} /> },
      { path: '*', element: <Home /> },
    ],
  },
])

const App: React.FC = () => {
  patchDOMForGoogleTranslate()

  // register global Hotkeys
  useHotkeys('shift+n', () => {
    window.location.href = '/new-banner'
  })

  return (
    <Suspense fallback="Loading...">
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        }}
        onEvent={(e) => e === 'onReady' && updateApiState()}
      >
        <Helmet
          defer={false}
          defaultTitle="Bannergress"
          titleTemplate="%s - Bannergress"
        />
        <Layout>
          <RouterProvider router={router} />
        </Layout>
      </ReactKeycloakProvider>
    </Suspense>
  )
}

export default App
