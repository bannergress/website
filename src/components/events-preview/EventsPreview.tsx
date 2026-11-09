import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BannerFilter } from '../../features/banner/filter'
import { useBannerList } from '../../features/banner/hooks'
import BannerList from '../banner-list'

const EventsPreview: React.FC = () => {
  const { t } = useTranslation()
  const filter: BannerFilter = useMemo(() => {
    const currentTimestamp = new Date().toISOString()
    return {
      minEventTimestamp: currentTimestamp,
      maxEventTimestamp: currentTimestamp,
      orderBy: 'created',
      orderDirection: 'DESC',
      online: true,
    }
  }, [])
  const { status, data, hasMore } = useBannerList(filter, Infinity)
  return data.length ? (
    <div>
      <h1>{t('events.title')}</h1>
      <BannerList
        banners={data}
        hasMoreBanners={hasMore && status !== 'rejected'}
        hideBlacklisted={false}
        showDetailsButton={false}
        applyBannerListStyles={true}
      />
    </div>
  ) : (
    <></>
  )
}

export default EventsPreview
