import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import NewsList from '../components/news-list'
import RecentBanners from '../components/recent-banners'
import { UserBannerListPreview } from '../components/user-banner-list-preview'
import FooterMain from '../components/footer-main'

import './home.less'
import EventsPreview from '../components/events-preview/EventsPreview'

export const Home: FC = () => {
  const { t } = useTranslation()
  const titleList: string = t('banners.latest')

  return (
    <div className="home page-container">
      <div className="announcement-and-recent-banners">
        <NewsList />
        <UserBannerListPreview />
        <EventsPreview />
        <RecentBanners titleList={titleList} />
      </div>
      <FooterMain />
    </div>
  )
}
