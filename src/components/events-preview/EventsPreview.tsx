import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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
  const { status, data } = useBannerList(filter, 1, 4)
  return status === 'resolved' && data.length ? (
    <div>
      <h1>{t('events.title')}</h1>
      <BannerList
        banners={data.slice(0, 3)}
        hasMoreBanners={false}
        hideBlacklisted={false}
        showDetailsButton={false}
        applyBannerListStlyes={true}
      />
      {data.length >= 4 && (
        <div className="seeFullList">
          <Link to={'/events'}>{t('banners.full')}</Link>
        </div>
      )}
    </div>
  ) : (
    <></>
  )
}

export default EventsPreview
