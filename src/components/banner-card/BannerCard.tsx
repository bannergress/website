import React, { Fragment, FC } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Card, Row } from 'antd'

import { Scrollbars } from 'react-custom-scrollbars'

import './Banner-card.less'

import { ReactComponent as SVGExplorer } from '../../img/icons/explorer.svg'
import { ReactComponent as SVGPointer } from '../../img/icons/pointer.svg'

// import { actionTypes, selectors } from '../../features/counter'
type IBanner = {
  title: string
  countMission: number
  id: number
  distance: string
  mapTitle: string
}
type IMission = {
  id: number
  color: string
  name: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BannerCard: FC<IBanner> = ({
  title,
  countMission,
  id,
  mapTitle,
  distance,
}) => {
  let missionList: Array<IMission> = []
  for (let i = 0; i < countMission; i += 1) {
    missionList = [
      ...missionList,
      {
        color: '#000',
        id: i,
        name: `test mission ${i}`,
      },
    ]
  }

  return (
    <Fragment>
      <div className="banner-card" key={id}>
        <Card title={title} style={{ width: 448 }}>
          <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={284}>
            <Row align="top" justify="start" className="banner-pic">
              {missionList.map((mission) => (
                <div
                  className="banner-circle"
                  color={mission.color}
                  title={mission.name}
                  key={mission.id}
                >
                  {mission.id + 1}
                </div>
              ))}
            </Row>
          </Scrollbars>
          <div className="mt-1" />
          <Row align="middle">
            <SVGExplorer fill="#1DA57A" className="icon" />
            {countMission} Missions, {distance}
          </Row>
          <Row align="middle">
            <SVGPointer fill="#1DA57A" className="icon" />
            {mapTitle}
          </Row>
        </Card>
      </div>
    </Fragment>
  )
}

export default BannerCard
