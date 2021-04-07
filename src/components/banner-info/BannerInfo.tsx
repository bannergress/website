import React, { Fragment, FC } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Card, Row } from 'antd'

import { Scrollbars } from 'react-custom-scrollbars'

import './Banner-info.less'

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

const BannerInfo: FC<IBanner> = ({
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
          <Row>
            {countMission} Missions, {distance}
          </Row>
          <Row>{mapTitle}</Row>
        </Card>
      </div>
    </Fragment>
  )
}

export default BannerInfo
