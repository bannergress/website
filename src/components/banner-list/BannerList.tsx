import React, { FC, useEffect, useRef } from 'react'
import { Link, generatePath } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Banner, changeBannerSettings } from '../../features/banner'
import type { AppDispatch } from '../../store'
import { useInfiniteScroll } from '../../hooks/InfiniteScroll'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'
import BannerCard from '../banner-card'
import BannerListTypeControl from '../banner-list-type-control'

import './BannerList.scss'

const BannerList: FC<BannerListProps> = ({
  banners,
  hasMoreBanners,
  loadMoreBanners,
  selectedBannerId,
  onSelectBanner,
  applyBannerListStyles,
  hideBlacklisted,
  showDetailsButton,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { authenticated } = useUserLoggedIn()
  const itemsRef = useRef<Array<HTMLDivElement | null>>([])
  const [ref] = useInfiniteScroll({
    callback: loadMoreBanners,
  })

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, banners?.length || 0)
  }, [banners])

  useEffect(() => {
    const index = banners?.findIndex((b) => b.id === selectedBannerId)
    if (index !== undefined && index >= 0 && itemsRef.current[index]) {
      itemsRef.current[index]!.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [banners, selectedBannerId])

  const { t } = useTranslation()

  const getBannerCardWithLink = (
    banner: Banner,
    contents: React.JSX.Element
  ) =>
    onSelectBanner ? (
      <div
        key={banner.id}
        role="button"
        title={banner.title}
        onClick={() => onSelectBanner(banner)}
        onKeyDown={(e) => e.key === 'Enter' && onSelectBanner(banner)}
        className="banner-card-link"
        tabIndex={0}
      >
        {contents}
      </div>
    ) : (
      <Link
        key={banner.id}
        to={generatePath('/banner/:id', { id: banner.id })}
        title={banner.title}
      >
        {contents}
      </Link>
    )

  if ((banners && banners.length > 0) || hasMoreBanners) {
    return (
      <>
        <div className="banner-list">
          {banners?.map((banner, index) => {
            if (hideBlacklisted && banner?.listType === 'blacklist') {
              return null
            }

            const bannerCard = getBannerCardWithLink(
              banner,
              <BannerCard
                key={banner.id}
                banner={banner}
                selected={banner.id === selectedBannerId}
                detailsUrl={
                  showDetailsButton
                    ? generatePath('/banner/:id', { id: banner.id })
                    : undefined
                }
                linkStartPlace={false}
                applyBannerListStlye={applyBannerListStyles}
              />
            )
            return (
              <div
                className={`banner-list-entry${authenticated ? ' has-list-control' : ''}`}
                key={banner.id}
                ref={(b) => {
                  itemsRef.current[index] = b
                }}
              >
                {bannerCard}
                {authenticated && (
                  <BannerListTypeControl
                    compact
                    bannerListType={banner.listType}
                    onChangeListType={(listType) =>
                      dispatch(changeBannerSettings(banner, { listType }))
                    }
                  />
                )}
              </div>
            )
          })}
          {hasMoreBanners && (
            <div ref={ref} className="banner-card">
              {t('loadingMore')}
            </div>
          )}
        </div>
      </>
    )
  }
  return null
}

export interface BannerListProps {
  banners: Array<Banner> | undefined
  hasMoreBanners: boolean
  selectedBannerId?: string
  loadMoreBanners?: () => void | Promise<void>
  onSelectBanner?: (banner: Banner) => void
  applyBannerListStyles: boolean
  hideBlacklisted: boolean
  showDetailsButton: boolean
}

export default BannerList
