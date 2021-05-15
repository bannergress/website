import React from 'react'

import NewsList from '../components/news-list'
import RecentBanners from '../components/recent-banners'
import FooterMain from '../components/footer-main'

import './home.less'

export const Home: React.FC = () => {
  const titleList: string = 'Latest Banners'
  return (
    <div className="home page-container">
      <div className="announcement-and-recent-banners">
        <NewsList />
        <RecentBanners titleList={titleList} />
      </div>
      <FooterMain />
    </div>
  )
}
