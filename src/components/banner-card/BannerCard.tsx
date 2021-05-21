import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

import { Banner } from '../../features/banner'
import BannerPicture from './BannerPicture'
import { ReactComponent as SVGExplorer } from '../../img/icons/explorer.svg'
import { ReactComponent as SVGPointer } from '../../img/icons/pointer.svg'

import './banner-card.less'
import { Distance } from '../distance/Distance'

const baseUrl = process.env.REACT_APP_API_BASE_URL

const BannerCard: FC<BannerCardProps> = ({
  banner,
  selected,
  showFullImage,
  showZoomButton,
  detailsUrl,
  onZoom,
}) => {
  const url = banner && banner.picture && new URL(banner.picture, baseUrl).href
  const className = selected ? 'banner-card selected' : 'banner-card'

  return (
    <div className={className}>
      <div className="banner-card-title">{banner?.title}</div>
      {banner && url && (
        <BannerPicture
          url={url}
          title={banner.title}
          size={banner.width ?? 6}
          showFullImage={showFullImage}
        />
      )}
      <div className="banner-info-item">
        <div className="banner-info-item-icon">
          <SVGExplorer className="icon" />
        </div>
        <div>
          {banner?.numberOfMissions} Missions,{' '}
          {banner && banner.lengthMeters ? (
            <Distance distanceMeters={banner?.lengthMeters} />
          ) : null}
        </div>
      </div>
      <div className="banner-info-item">
        <div className="banner-info-item-icon">
          <SVGPointer className="icon" />
        </div>
        <div>{banner?.formattedAddress}</div>
      </div>
      {selected && detailsUrl && (
        <div className="banner-info-details">
          <Link to={detailsUrl}>Details</Link>
          {showZoomButton && onZoom && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onZoom()
              }}
            >
              Zoom
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export interface BannerCardProps {
  banner: Banner | undefined
  selected: boolean
  showFullImage?: boolean
  showZoomButton?: boolean
  detailsUrl?: string
  onZoom?: () => void
}

export default BannerCard
