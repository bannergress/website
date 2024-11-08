import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'

import {
  Banner,
  isBannerFullyOnline,
  isBannerFullyOffline,
} from '../../features/banner'
import { createBrowseUri } from '../../features/place'
import { Distance } from '../distance/Distance'
import BannerPicture from './BannerPicture'
import SVGExplorer from '../../assets/img/icons/explorer.svg?react'
import SVGWarningTriangle from '../../assets/img/icons/warningtriangle.svg?react'
import SVGPointer from '../../assets/img/icons/pointer.svg?react'

import './BannerCard.scss'

const baseUrl = import.meta.env.VITE_API_BASE_URL

const BannerCard: FC<BannerCardProps> = ({
  banner,
  selected,
  showFullImage,
  detailsUrl,
  linkStartPlace,
  applyBannerListStlye,
}) => {
  const { t } = useTranslation()

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

    const offline =
      banner.numberOfDisabledMissions > 0
        ? t('missions.offline', { count: banner.numberOfDisabledMissions })
        : undefined

    const missing =
      banner.numberOfSubmittedMissions > 0
        ? t('missions.missing', { count: banner.numberOfSubmittedMissions })
        : undefined
    return (
      <>
        {t('missions.number', { count: banner?.numberOfMissions })}
        {fullyOffline && t('missions.offlineAll')}
        {!fullyOffline && (offline || missing) && (
          <>
            {' '}
            ({offline}
            {offline && missing ? ', ' : ''}
            {missing})
          </>
        )}
        {banner &&
          !fullyOffline &&
          banner.lengthMeters !== undefined &&
          banner.lengthMeters > 0 && (
            <>
              , <Distance distanceMeters={banner?.lengthMeters} />
            </>
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
              <Trans
                i18nKey="banners.offline"
                components={{
                  icon: <SVGWarningTriangle />,
                }}
              />
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
          <Link to={detailsUrl}>{t('buttons.details')}</Link>
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
