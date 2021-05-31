import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ThunkDispatch } from 'redux-thunk'

import { getRecentBanners, loadRecentBanners } from '../../features/banner'
import { BannerActionTypes } from '../../features/banner/actionTypes'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'
import { RootState } from '../../storeTypes'
import BannerList from '../banner-list'
import LoadingOverlay from '../loading-overlay'

import './recent-banners.less'

type AppDispatch = ThunkDispatch<RootState, any, BannerActionTypes>

export const RecentBanners: FC<RecentBannersProps> = ({ titleList }) => {
  const history = useHistory()
  const dispatch: AppDispatch = useDispatch()
  const banners = useSelector(getRecentBanners)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    dispatch(loadRecentBanners()).finally(() => setLoading(false))
  }, [dispatch, history.location])

  const onCreateBanner = () => {
    history.push('/new-banner')
  }

  const { authenticated } = useUserLoggedIn()
  const disabled = !authenticated

  return (
    <div className="recent-banners">
      <LoadingOverlay
        active={loading}
        spinner
        fadeSpeed={500}
        text="Loading recent banners..."
      />
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

export interface RecentBannersProps {
  titleList: string
}

export default RecentBanners
