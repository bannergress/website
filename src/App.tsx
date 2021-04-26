import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { Helmet } from 'react-helmet'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'

import Navbar from './components/navbar'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { MapOverview } from './pages/map-overview'
import { BannerInfo } from './pages/banner-info'
import { Search } from './pages/search'
import { Browser } from './pages/browser'
import BannerList from './components/recent-banners'
import { authenticateApi } from './api'

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
        <Layout>
          <Header className="px-1">
            <Navbar />
          </Header>
        </Layout>
        <Layout>
          <div className="container">
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/about" component={About} />
              <Route path="/map/" component={MapOverview} />
              <Route path="/browse/:places*" component={Browser} />
              <Route path="/favorites" component={BannerList} />
              <Route path="/banner/:id" component={BannerInfo} />
              <Route path="/search/:term" component={Search} />
              <Route component={Home} />
            </Switch>
          </div>
        </Layout>
      </BrowserRouter>
    </Layout>
  </ReactKeycloakProvider>
)

export default App
