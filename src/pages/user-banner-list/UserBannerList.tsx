import { FC, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import { BannerListType, getBannerListTypeText } from '../../features/banner'
import { BannerFilter } from '../../features/banner/filter'

import BannerListTypeNavigation from '../../components/banner-list-type-navigation'
import FooterMain from '../../components/footer-main'
import LoginRequired from '../../components/login/login-required'
import InfiniteBannerList from '../../components/infinite-banner-list/InfiniteBannerList'

import './user-banner-list.less'

const UserBannerList: FC = () => {
  const { listType } = useParams<{ listType: BannerListType }>()
  const { t } = useTranslation()
  const title = t('banners.mine', { type: getBannerListTypeText(listType) })

  const initialFilter: BannerFilter = {
    listTypes: listType,
    orderBy: 'listAdded',
    orderDirection: 'DESC',
    online: undefined,
  }

  return (
    <Fragment>
      <Helmet defer={false}>
        <title>{title}</title>
      </Helmet>
      <div className="user-banner-list-page page-container">
        <div className="user-banner-list-content">
          <BannerListTypeNavigation
            bannerListType={listType}
            baseUrl="/user/banners/"
          />

          <LoginRequired>
            <InfiniteBannerList
              includeAddedList
              initialFilter={initialFilter}
              noResultsMessage={t('banners.markinfo', {
                type: getBannerListTypeText(listType),
              })}
            />
          </LoginRequired>
        </div>
        <FooterMain />
      </div>
    </Fragment>
  )
}

export default UserBannerList
