import React from 'react'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '../../components/page-title/PageTitle'
import FooterMain from '../../components/footer-main'
import RecentBanners from '../../components/recent-banners'

import './Error.scss'

const Error: React.FC = () => {
  const { t } = useTranslation()
  const titleList: string = t('error.newestBanners')

  return (
    <div className="error-page">
      <PageTitle title={t('error.title')} />
      <div className="error-page__title">
        <h1>{t('error.title')}</h1>
      </div>
      <div className="error-page__content">
        <RecentBanners titleList={titleList} />
      </div>
      <FooterMain />
    </div>
  )
}

export default Error
