import { handleAsync } from '../../features/utils/async'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import { BannerListType, getBannerListTypeText } from '../../features/banner'
import { ChoiceButton } from '../choice-buttons/ChoiceButton'
import '../choice-buttons/ChoiceButtons.scss'

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
        <Link
          className={`choice-button banner-list-type ${activeClass}`}
          to={link}
        >
          {getBannerListTypeText(listType)}
        </Link>
      )
    }

    if (!active && onClickListType) {
      return (
        <ChoiceButton
          type="button"
          className={`banner-list-type  ${activeClass}`}
          onClick={handleAsync(() => onClickListType(listType))}
        >
          {getBannerListTypeText(listType)}
        </ChoiceButton>
      )
    }

    return (
      <span
        className={`choice-button banner-list-type ${activeClass}`}
        aria-current={active ? 'page' : undefined}
      >
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
  onClickListType?: (bannerListType: BannerListType) => void | Promise<void>
}

export default BannerListTypeNavigation
