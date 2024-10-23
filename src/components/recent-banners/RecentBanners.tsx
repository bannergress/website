import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import BannerList from '../banner-list'
import LoadingOverlay from '../loading-overlay'

import './recent-banners.less'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'
import { useBannerList } from '../../features/banner/hooks'
import { BannerFilter } from '../../features/banner/filter'

export const RecentBanners: FC<RecentBannersProps> = ({ titleList }) => {
  const { t } = useTranslation()
  const { authenticated } = useUserLoggedIn()
  const filter = useMemo<BannerFilter>(
    () => ({
      orderBy: 'created',
      orderDirection: 'DESC',
      online: true,
      listTypes: authenticated ? ['none', 'done', 'todo'] : undefined,
    }),
    [authenticated]
  )
  const { status, data } = useBannerList(filter, 1, 12)

  return (
    <div className="recent-banners">
      <LoadingOverlay
        active={status === 'pending'}
        text={t('banners.loadingRecent')}
      />
      <div className="recent-banners-title">
        <h1>{titleList}</h1>
      </div>
      <BannerList
        banners={data}
        hasMoreBanners={false}
        applyBannerListStyles
        hideBlacklisted={false}
        showDetailsButton={false}
      />
    </div>
  )
}

export interface RecentBannersProps {
  titleList: string
}

export default RecentBanners
