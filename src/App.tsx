import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'

import Navbar from './components/navbar'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { Map } from './pages/map'
import { BannerInfo } from './pages/banner-info'
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
              <Route path="/map" component={Map} />
              <Route path="/browse" component={Browser} />
              <Route path="/favorites" component={BannerList} />
              <Route path="/banner/:id" component={BannerInfo} />
            </Switch>
          </div>
        </Layout>
      </BrowserRouter>
    </Layout>
  </ReactKeycloakProvider>
)

export default App
