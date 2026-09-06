import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import { BannerListType, getBannerListTypeText } from '../../features/banner'

import './BannerListTypeNavigation.scss'

const BannerListTypeNavigation: FC<BannerListTypeNavigationProps> = ({
  bannerListType,
  baseUrl,
  onClickListType,
}) => {
  const getButton = (listType: BannerListType) => {
    const active = bannerListType === listType
    const activeClass = active ? 'active' : 'inactive'

    if (!active && baseUrl) {
      const link = `${baseUrl}${listType}`

      return (
        <Link className={`banner-list-type  ${activeClass}`} to={link}>
          {getBannerListTypeText(listType)}
        </Link>
      )
    }

    if (!active && onClickListType) {
      return (
        <button
          type="button"
          className={`banner-list-type  ${activeClass}`}
          onClick={() => onClickListType(listType)}
        >
          {getBannerListTypeText(listType)}
        </button>
      )
    }

    return (
      <span className={`banner-list-type  ${activeClass}`}>
        {getBannerListTypeText(listType)}
      </span>
    )
  }

  return (
    <div className="banner-list-type-navigation">
      {getButton('todo')}
      {getButton('done')}
      {getButton('blacklist')}
    </div>
  )
}

export interface BannerListTypeNavigationProps {
  bannerListType: BannerListType
  baseUrl?: string
  onClickListType?: (bannerListType: BannerListType) => Promise<void>
}

export default BannerListTypeNavigation
