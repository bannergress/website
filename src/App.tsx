import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Helmet } from 'react-helmet'
import { ReactKeycloakProvider } from '@react-keycloak/web'

import { useHotkeys } from 'react-hotkeys-hook'
import keycloak from './keycloak'

import { updateApiState } from './api'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { MapOverview } from './pages/map-overview'
import { BannerInfo } from './pages/banner-info'
import { Search } from './pages/search'
import { Agent } from './pages/agent'
import { Browser } from './pages/browser'
import { CreateBanner } from './pages/create-banner'
import { PreviewBanner } from './pages/preview-banner'
import { PrivateRoute } from './components/login/private-route'
import { Help } from './pages/help'
import MenuMain from './components/menu-main'
import Navbar from './components/navbar'

import './App.less'

const App: React.FC = () => {
  // register global Hotkeys
  useHotkeys('shift+n', () => {
    window.location.href = '/new-banner'
  })

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      }}
      onEvent={(e) => e === 'onReady' && updateApiState()}
    >
      <Helmet defaultTitle="Bannergress" titleTemplate="Bannergress - %s" />
      <Layout>
        <BrowserRouter>
          {/* The Navbar should be hidden in mobile mode but only on some pages. */}
          {/* So we add a class to it if we are on those pages */}
          <Switch>
            <Route path={['/banner/:id', '/preview-banner']}>
              <Navbar className="hide-on-mobile" />
            </Route>
            <Route>
              <Navbar />
            </Route>
          </Switch>
          <Layout className="main">
            <div className="container">
              <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/about" component={About} />
                <Route path="/map" component={MapOverview} />
                <Route path="/browse/:placeId?" component={Browser} />
                <Route path="/banner/:id" component={BannerInfo} />
                <Route path="/search/:term" component={Search} />
                <Route path="/agent/:agentName" component={Agent} />
                <Route path="/help" component={Help} />
                <PrivateRoute path="/new-banner" component={CreateBanner} />
                <PrivateRoute
                  path="/edit-banner/:id"
                  component={CreateBanner}
                  roles="manage-banners"
                />
                <PrivateRoute
                  path="/preview-banner"
                  component={PreviewBanner}
                />
                <Route component={Home} />
              </Switch>
            </div>
          </Layout>
          <div className="bottom-menu">
            <MenuMain />
          </div>
        </BrowserRouter>
      </Layout>
    </ReactKeycloakProvider>
  )
}

export default App
