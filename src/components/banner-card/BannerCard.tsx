import React, { FC } from 'react'

import { Banner } from '../../features/banner'
import { ReactComponent as SVGExplorer } from '../../img/icons/explorer.svg'
import { ReactComponent as SVGPointer } from '../../img/icons/pointer.svg'

import './banner-card.less'

const baseUrl = process.env.REACT_APP_API_BASE_URL

const getDistance = (distance: number) => `${(distance / 1000).toFixed(1)} km`

const BannerCard: FC<BannerCardProps> = ({ banner, selected }) => {
  const url = banner && banner.picture && new URL(banner.picture, baseUrl).href
  const className = selected ? 'banner-card selected' : 'banner-card'
  const innerClassName =
    banner && banner.numberOfMissions > 18
      ? 'banner-card-picture-inner banner-card-picture-inner-animated'
      : 'banner-card-picture-inner'
  return (
    <div className={className}>
      <div className="banner-card-title">{banner?.title}</div>
      {banner && url && (
        <div className="banner-card-picture">
          <div
            className={innerClassName}
            style={{ backgroundImage: `url(${url})` }}
          >
            <img alt={banner.title} src={url} />
          </div>
        </div>
      )}
      <div className="banner-info-item">
        <SVGExplorer fill="#1DA57A" className="icon" />
        {banner?.numberOfMissions} Missions,{' '}
        {banner && banner.lengthMeters
          ? getDistance(banner?.lengthMeters)
          : null}
      </div>
      <div className="banner-info-item">
        <SVGPointer fill="#1DA57A" className="icon" />
        {banner?.formattedAddress}
      </div>
    </div>
  )
}

export interface BannerCardProps {
  banner: Banner | undefined
  selected: boolean
}

export default BannerCard
