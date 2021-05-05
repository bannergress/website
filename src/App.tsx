import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Helmet } from 'react-helmet'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'

import { authenticateApi } from './api'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { MapOverview } from './pages/map-overview'
import { BannerInfo } from './pages/banner-info'
import { Search } from './pages/search'
import { Browser } from './pages/browser'
import { CreateBanner } from './pages/create-banner'
import { PreviewBanner } from './pages/preview-banner'
import { PrivateRoute } from './components/login/private-route'
import { Help } from './pages/help'
import MenuMain from './components/menu-main'
import Navbar from './components/navbar'

import './App.less'

const App: React.FC = () => (
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    }}
    onTokens={(tokens) => authenticateApi(tokens)}
  >
    <Helmet defaultTitle="Bannergress" titleTemplate="Bannergress - %s" />
    <Layout>
      <BrowserRouter>
        <Navbar />
        <Layout className="main">
          <div className="container">
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/about" component={About} />
              <Route path="/map" component={MapOverview} />
              <Route path="/browse/:places*" component={Browser} />
              <Route path="/banner/:id" component={BannerInfo} />
              <Route path="/search/:term" component={Search} />
              <Route path="/help" component={Help} />
              <PrivateRoute path="/new-banner" component={CreateBanner} />
              <PrivateRoute path="/preview-banner" component={PreviewBanner} />
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

export default App
