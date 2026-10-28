import { FC, useMemo } from 'react'
import { PageTitle } from '../../components/page-title/PageTitle'
import { useTranslation } from 'react-i18next'
import FooterMain from '../../components/footer-main'
import InfiniteBannerList from '../../components/infinite-banner-list/InfiniteBannerList'
import { BannerFilter } from '../../features/banner/filter'

const Events: FC = () => {
  const { t } = useTranslation()
  const title = t('events.title')

  const initialFilter = useMemo<BannerFilter>(() => {
    const currentTimestamp = new Date().toISOString()
    return {
      minEventTimestamp: currentTimestamp,
      maxEventTimestamp: currentTimestamp,
      orderBy: 'created',
      orderDirection: 'DESC',
      online: true,
    }
  }, [])

  return (
    <>
      <PageTitle title={title} />
      <div className="user-banner-list-page page-container">
        <div className="user-banner-list-content">
          <h1>{title}</h1>
          <InfiniteBannerList
            filterKey="events"
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
