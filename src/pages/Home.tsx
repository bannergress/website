import React, { Fragment } from 'react'
import { Divider } from 'antd'
import Announcement from '../components/announcement'
import RecentBanners from '../components/recent-banners'
import FooterMain from '../components/footer-main'

export const Home: React.FC = () => {
  const titleList: string = 'Latest Banners'
  return (
    <Fragment>
      <div className="mt-1">
        <Announcement />
        <Divider type="horizontal" />
      </div>
      <RecentBanners titleList={titleList} />
      <div className="mt-1" />
      <FooterMain />
    </Fragment>
  )
}
