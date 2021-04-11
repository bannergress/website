import React, { Fragment, FC } from 'react'
import { Row } from 'antd'
import { useHistory } from 'react-router-dom'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'

import './banner-list.less'

const BannerList: FC<BannerListProps> = ({ banners }) => {
  const goToBanner = (bannerId: number) =>
    useHistory().push(`/banner/${bannerId}`)

  if (banners && banners.length > 0) {
    return (
      <Fragment>
        <Row justify="space-around" className="banner-list" gutter={[16, 16]}>
          {banners?.map((bannerItem) => (
            <div
              className="banner-card"
              onClick={() => goToBanner(bannerItem.id)}
              onKeyPress={() => goToBanner(bannerItem.id)}
              role="link"
              tabIndex={0}
            >
              <BannerCard banner={bannerItem} key={bannerItem.id} />
            </div>
          ))}
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
}

export default BannerList
