import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import {
  Banner,
  isBannerFullyOnline,
  isBannerFullyOffline,
} from '../../features/banner'
import { createBrowseUri } from '../../features/place'
import BannerPicture from './BannerPicture'
import { ReactComponent as SVGExplorer } from '../../img/icons/explorer.svg'
import { ReactComponent as SVGWarningTriangle } from '../../img/icons/warningtriangle.svg'
import { ReactComponent as SVGPointer } from '../../img/icons/pointer.svg'

import './banner-card.less'
import { Distance } from '../distance/Distance'

const baseUrl = process.env.REACT_APP_API_BASE_URL

const BannerCard: FC<BannerCardProps> = ({
  banner,
  selected,
  showFullImage,
  detailsUrl,
  linkStartPlace,
  applyBannerListStlye,
}) => {
  const url = banner && banner.picture && new URL(banner.picture, baseUrl).href

  const bannerListStyleClassName =
    banner && applyBannerListStlye
      ? `list-style-${banner.listType || 'none'}`
      : ''
  let className = selected ? `banner-card selected` : `banner-card`
  className = `${className} ${bannerListStyleClassName}`
  let lines: number | undefined
  if (banner?.numberOfMissions && banner.width) {
    lines = Math.ceil(banner.numberOfMissions / banner.width)
  }

  const fullyOnline = banner && isBannerFullyOnline(banner)
  const fullyOffline = banner && isBannerFullyOffline(banner)

  const getMissionInfo = () => {
    if (!banner) return null

    return (
      <>
        {banner?.numberOfMissions} Missions,{' '}
        {fullyOffline && <>(all offline) </>}
        {!fullyOffline &&
          banner.numberOfSubmittedMissions > 0 &&
          banner.numberOfDisabledMissions > 0 && (
            <>
              ({banner.numberOfDisabledMissions} offline,{' '}
              {banner.numberOfSubmittedMissions} missing){' '}
            </>
          )}
        {!fullyOffline &&
          banner.numberOfSubmittedMissions > 0 &&
          banner.numberOfDisabledMissions === 0 && (
            <>({banner.numberOfSubmittedMissions} missing) </>
          )}
        {!fullyOffline &&
          banner.numberOfDisabledMissions > 0 &&
          banner.numberOfSubmittedMissions === 0 && (
            <>({banner.numberOfDisabledMissions} offline) </>
          )}
        {banner && !fullyOffline && banner.lengthMeters && (
          <Distance distanceMeters={banner?.lengthMeters} />
        )}
      </>
    )
  }
  return (
    <div className={className}>
      <div className="banner-card-title">{banner?.title}</div>
      <div className="banner-card-picture-container">
        {banner && url && (
          <BannerPicture
            url={url}
            title={banner.title}
            size={banner.width ?? 6}
            showFullImage={showFullImage}
            lines={lines}
          />
        )}

        {fullyOffline && (
          <div className="offline-overlay">
            <div className="offline-overlay-line">
              <SVGWarningTriangle /> BANNER OFFLINE
            </div>
          </div>
        )}
      </div>
      <div className={`banner-info-item ${fullyOnline ? '' : 'warning'}`}>
        <div className="banner-info-item-icon">
          {fullyOnline ? (
            <SVGExplorer className="icon" />
          ) : (
            <SVGWarningTriangle className="icon" />
          )}
        </div>
        <div>{getMissionInfo()}</div>
      </div>
      <div className="banner-info-item">
        <div className="banner-info-item-icon">
          <SVGPointer className="icon" />
        </div>
        {linkStartPlace && banner?.startPlaceId ? (
          <div>
            <Link to={createBrowseUri(banner.startPlaceId)}>
              {banner?.formattedAddress}
            </Link>
          </div>
        ) : (
          <div>{banner?.formattedAddress}</div>
        )}
      </div>
      {detailsUrl && (
        <div className="banner-info-details">
          <Link to={detailsUrl}>Details</Link>
        </div>
      )}
    </div>
  )
}

export interface BannerCardProps {
  banner: Banner | undefined
  selected: boolean
  showFullImage?: boolean
  applyBannerListStlye: boolean
  detailsUrl?: string
  linkStartPlace: boolean
}

export default BannerCard
