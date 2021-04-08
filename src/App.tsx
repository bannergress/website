import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'

import Navbar from './components/navbar'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { Map } from './pages/Map'
// import { BannerDetails } from './pages/BannerDetails'
import BannerList from './components/banner-list'
import BannerInfo from './components/banner-info'

import './App.less'

const App: React.FC = () => (
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
            <Route path="/favorites" component={BannerList} />
            <Route path="/banner/:id" component={BannerInfo} />
          </Switch>
        </div>
      </Layout>
    </BrowserRouter>
  </Layout>
)

export default App
