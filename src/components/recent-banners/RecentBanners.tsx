import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ThunkDispatch } from 'redux-thunk'

import { getRecentBanners, loadRecentBanners } from '../../features/banner'
import { BannerActionTypes } from '../../features/banner/actionTypes'
import { RootState } from '../../storeTypes'
import BannerList from '../banner-list'
import { Issue } from '../Issues-list'
import LoadingOverlay from '../loading-overlay'

import './recent-banners.less'

type AppDispatch = ThunkDispatch<RootState, any, BannerActionTypes>

export const RecentBanners: FC<RecentBannersProps> = ({
  titleList,
  setIssues,
  resetIssue,
}) => {
  const history = useHistory()
  const dispatch: AppDispatch = useDispatch()
  const banners = useSelector(getRecentBanners)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    resetIssue('recent-fetch-error')
    dispatch(loadRecentBanners())
      .catch(() =>
        setIssues([
          {
            key: 'recent-fetch-error',
            type: 'error',
            message: 'Error loading recent banners, please try again later',
            field: 'recentBanners',
          },
        ])
      )
      .finally(() => setLoading(false))
  }, [dispatch, setIssues, resetIssue, history.location])

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
      </div>
      <BannerList
        banners={banners}
        hasMoreBanners={false}
        applyBannerListStlyes
        hideBlacklisted
      />
    </div>
  )
}

export interface RecentBannersProps {
  titleList: string
  setIssues: (issues: Array<Issue>) => void
  resetIssue: (key: string) => void
}

export default RecentBanners
