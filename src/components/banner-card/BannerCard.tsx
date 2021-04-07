import React, { Fragment, FC } from 'react'
import { Card, Row } from 'antd'

import { Scrollbars } from 'react-custom-scrollbars'

import './Banner-card.less'

import { ReactComponent as SVGExplorer } from '../../img/icons/explorer.svg'
import { ReactComponent as SVGPointer } from '../../img/icons/pointer.svg'
import { Banner, Dictionary, Mission } from '../../features/banner/types'

const getDistance = (distance: number) => `${distance / 100}km`
const renderMissions = (
  missions: Dictionary<Mission>,
  numberOfMissions: number
) => {
  const renderedMissions: Array<JSX.Element> = []
  for (let i = 0; i < numberOfMissions; i += 1) {
    renderedMissions.push(
      <div
        className="banner-circle"
        color="#000"
        title={missions[i].title}
        key={missions[i].id}
        style={{
          backgroundImage: `url('${missions[i].picture}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100%',
        }}
      />
    )
  }
  return renderedMissions
}

const BannerCard: FC<BannerCardProps> = ({ banner }) => (
  <Fragment>
    <div className="banner-card" key={banner.id}>
      <Card title={banner.title} style={{ width: 448 }}>
        <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={284}>
          <Row align="top" justify="start" className="banner-pic">
            {renderMissions(banner.missions, banner.numberOfMissions)}
          </Row>
        </Scrollbars>
        <div className="mt-1" />
        <Row align="middle">
          <SVGExplorer fill="#1DA57A" className="icon" />
          {banner.numberOfMissions} Missions, {getDistance(banner.lenghtMeters)}
        </Row>
        <Row align="middle">
          <SVGPointer fill="#1DA57A" className="icon" />
          New York, NY
        </Row>
      </Card>
    </div>
  </Fragment>
)

export interface BannerCardProps {
  banner: Banner
}

export default BannerCard
