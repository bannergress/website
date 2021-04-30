import React from 'react'
import Announcement from '../components/announcement'
import RecentBanners from '../components/recent-banners'
import FooterMain from '../components/footer-main'

import './home.less'

export const Home: React.FC = () => {
  const titleList: string = 'Latest Banners'
  return (
    <div className="home">
      <div className="announcement-and-recent-banners">
        <Announcement />
        <RecentBanners titleList={titleList} />
      </div>
      <FooterMain />
    </div>
  )
}
