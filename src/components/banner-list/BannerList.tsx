import React, { Fragment, FC } from 'react'
import { Row } from 'antd'
import { useHistory } from 'react-router-dom'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'

import './banner-list.less'
import { useInfiniteScroll } from '../../hooks/InfiniteScroll'

const BannerList: FC<BannerListProps> = ({
  banners,
  hasMoreBanners,
  loadMoreBanners,
}) => {
  const history = useHistory()
  const [ref] = useInfiniteScroll({
    callback: loadMoreBanners,
  })
  const goToBanner = (bannerId: string) => history.push(`/banner/${bannerId}`)

  if (banners && banners.length > 0) {
    return (
      <Fragment>
        <Row justify="space-around" className="banner-list" gutter={[16, 16]}>
          {banners?.map((bannerItem) => (
            <div
              key={bannerItem.uuid}
              className="banner-card"
              onClick={() => goToBanner(bannerItem.uuid)}
              onKeyPress={() => goToBanner(bannerItem.uuid)}
              role="link"
              tabIndex={0}
            >
              <BannerCard banner={bannerItem} key={bannerItem.uuid} />
            </div>
          ))}
          {hasMoreBanners && <div ref={ref}>Loading more items...</div>}
        </Row>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <Row>Loading...</Row>
    </Fragment>
  )
}

export interface BannerListProps {
  banners: Array<Banner> | undefined
  hasMoreBanners: Boolean
  loadMoreBanners?: () => Promise<void>
}

export default BannerList
