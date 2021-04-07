import React, { Fragment } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Row, Layout, Button } from 'antd'
import BannerCard from '../banner-card'
// import { actionTypes, selectors } from '../../features/counter'

/* type IBannerList = {
  title: string
  // typeList: 'latest' | 'favorites' | 'filter'
  // modeView: 'tile' | 'list'
} */

const BannerList: React.FC<{ titleList: string }> = ({ titleList }) => {
  const bannerList = [
    {
      title: 'Banner #01',
      countMission: 24,
      id: 1,
      distance: '3.46 km',
      mapTitle: 'New York, NY, USA',
    },
    {
      title: 'Banner #02',
      countMission: 6,
      id: 2,
      distance: '3.46 km',
      mapTitle: 'New York, NY, USA',
    },
    {
      title: 'Banner #03',
      countMission: 12,
      id: 3,
      distance: '3.46 km',
      mapTitle: 'New York, NY, USA',
    },
    {
      title: 'Banner #04',
      countMission: 36,
      id: 4,
      distance: '3.46 km',
      mapTitle: 'New York, NY, USA',
    },
    {
      title: 'Banner #05',
      countMission: 48,
      id: 5,
      distance: '3.46 km',
      mapTitle: 'New York, NY, USA',
    },
    {
      title: 'Banner #06',
      countMission: 480,
      id: 6,
      distance: '3.46 km',
      mapTitle: 'New York, NY, USA',
    },
    {
      title: 'Banner #07',
      countMission: 24,
      id: 7,
      distance: '3.46 km',
      mapTitle: 'New York, NY, USA',
    },
    {
      title: 'Banner #08',
      countMission: 24,
      id: 8,
      distance: '3.46 km',
      mapTitle: 'New York, NY, USA',
    },
  ]
  return (
    <Fragment>
      <Row justify="center">
        <Layout>
          <div className="pl-1">
            <Row justify="space-between" className="pr-1">
              <h2>{titleList}</h2>
              <Button>Submit a New Banner</Button>
            </Row>
            <Row justify="center">
              {bannerList.map((bannerItem) => (
                <BannerCard {...bannerItem} key={bannerItem.id} />
              ))}
            </Row>
          </div>
        </Layout>
      </Row>
    </Fragment>
  )
}

export default BannerList
