import React, { FC, useEffect } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom'

import { RootState } from '../../storeTypes'
import {
  getRecentBanners,
  loadRecentBanners,
  Banner,
} from '../../features/banner'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'
import BannerList from '../banner-list'

import './recent-banners.less'

export const RecentBanners: FC<RecentBannersProps> = ({
  titleList,
  banners,
  fetchRecentBanners,
}) => {
  const history = useHistory()

  useEffect(() => {
    fetchRecentBanners()
  }, [fetchRecentBanners])

  const onCreateBanner = () => {
    history.push('/new-banner')
  }

  const { authenticated } = useUserLoggedIn()
  const disabled = !authenticated

  return (
    <div className="recent-banners">
      <div className="recent-banners-title">
        <h1>{titleList}</h1>
        <button
          type="button"
          onClick={onCreateBanner}
          className="positive-action-button submit-new-button"
          disabled={disabled}
        >
          Submit a New Banner
        </button>
      </div>
      <BannerList banners={banners} hasMoreBanners={false} />
    </div>
  )
}

export interface RecentBannersProps extends RouteComponentProps {
  titleList: string
  banners: Array<Banner>
  fetchRecentBanners: Function
}

const mapStateToProps = (state: RootState) => ({
  banners: getRecentBanners(state),
})

const mapDispatchToProps = {
  fetchRecentBanners: loadRecentBanners,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RecentBanners)
)
