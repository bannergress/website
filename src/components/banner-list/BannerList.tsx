import React, { Fragment, FC, useEffect, useRef } from 'react'
import { Row } from 'antd'
import { Link, generatePath } from 'react-router-dom'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'

import './banner-list.less'
import { useInfiniteScroll } from '../../hooks/InfiniteScroll'

const BannerList: FC<BannerListProps> = ({
  banners,
  hasMoreBanners,
  loadMoreBanners,
  selectedBannerId,
}) => {
  const itemsRef = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, banners?.length || 0)
  }, [banners])

  useEffect(() => {
    const index = banners?.findIndex((b) => b.uuid === selectedBannerId)
    if (index !== undefined && index >= 0 && itemsRef.current[index]) {
      itemsRef.current[index]!.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [banners, selectedBannerId])
  const [ref] = useInfiniteScroll({
    callback: loadMoreBanners,
  })

  if (banners && banners.length > 0) {
    return (
      <Fragment>
        <div className="banner-list">
          {banners?.map((bannerItem, index) => (
            <div
              key={bannerItem.uuid}
              ref={(b) => {
                itemsRef.current[index] = b
              }}
            >
              <Link
                key={bannerItem.uuid}
                to={generatePath('/banner/:uuid', { uuid: bannerItem.uuid })}
                title={bannerItem.title}
              >
                <BannerCard
                  key={bannerItem.uuid}
                  banner={bannerItem}
                  selected={bannerItem.uuid === selectedBannerId}
                />
              </Link>
            </div>
          ))}
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
  loadMoreBanners?: () => Promise<void>
  selectedBannerId?: string
}

export default BannerList
