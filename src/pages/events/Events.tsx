import { FC } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import FooterMain from '../../components/footer-main'
import InfiniteBannerList from '../../components/infinite-banner-list/InfiniteBannerList'
import { BannerFilter } from '../../features/banner/filter'

const Events: FC = () => {
  const { t } = useTranslation()
  const title = t('events.title')

  const currentTimestamp = new Date().toISOString()

  const initialFilter: BannerFilter = {
    minEventTimestamp: currentTimestamp,
    maxEventTimestamp: currentTimestamp,
    orderBy: 'created',
    orderDirection: 'DESC',
    online: true,
  }

  return (
    <>
      <Helmet defer={false}>
        <title>{title}</title>
      </Helmet>
      <div className="user-banner-list-page page-container">
        <div className="user-banner-list-content">
          <h1>{title}</h1>
          <InfiniteBannerList
            initialFilter={initialFilter}
            noResultsMessage={t('events.none')}
          />
        </div>
        <FooterMain />
      </div>
    </>
  )
}

export default Events
