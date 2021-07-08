import React, { Fragment, FC, useEffect, useRef } from 'react'
import { Row } from 'antd'
import { Link, generatePath } from 'react-router-dom'

import { Banner } from '../../features/banner'
import { useInfiniteScroll } from '../../hooks/InfiniteScroll'
import BannerCard from '../banner-card'

import './banner-list.less'

const BannerList: FC<BannerListProps> = ({
  banners,
  hasMoreBanners,
  loadMoreBanners,
  selectedBannerId,
  onSelectBanner,
}) => {
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

  const getBannerCardWithLink = (banner: Banner, contents: JSX.Element) =>
    onSelectBanner ? (
      <div
        key={banner.id}
        role="button"
        title={banner.title}
        onClick={() => onSelectBanner(banner)}
        onKeyPress={(e) => e.key === 'Enter' && onSelectBanner(banner)}
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

  if (banners && banners.length > 0) {
    return (
      <Fragment>
        <div className="banner-list">
          {banners?.map((banner, index) => {
            const bannerCard = getBannerCardWithLink(
              banner,
              <BannerCard
                key={banner.id}
                banner={banner}
                selected={banner.id === selectedBannerId}
                detailsUrl={generatePath('/banner/:id', { id: banner.id })}
                linkStartPlace={false}
              />
            )
            return (
              <div
                className="banner-list-entry"
                key={banner.id}
                ref={(b) => {
                  itemsRef.current[index] = b
                }}
              >
                {bannerCard}
              </div>
            )
          })}
          {hasMoreBanners && (
            <div ref={ref} className="banner-card">
              Loading more items...
            </div>
          )}
        </div>
      </Fragment>
    )
  }
  return <Fragment>{hasMoreBanners && <Row>Loading...</Row>}</Fragment>
}

export interface BannerListProps {
  banners: Array<Banner> | undefined
  hasMoreBanners: Boolean
  selectedBannerId?: string
  loadMoreBanners?: () => Promise<void>
  onSelectBanner?: (banner: Banner) => void
}

export default BannerList
