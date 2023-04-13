import React, { FC } from 'react'

import { Mission } from '../../features/mission'
import MissionImage from '../mission-image/MissionImage'

import './banner-image.less'

const BannerImage: FC<BannerImageProps> = ({ missions, width, useIndex }) => {
  const mapMissions = () => {
    if (!useIndex) {
      return missions.map((mission) => (
        <MissionImage key={mission.id} mission={mission} />
      ))
    }
    const result: Array<JSX.Element> = []
    let i = 0
    let j = 1
    while (i < missions.length) {
      const mission = missions[i]
      if (!mission.index || mission.index === j) {
        result.push(<MissionImage key={mission.id} mission={mission} />)
        i += 1
        j += 1
      } else if (mission.index < j) {
        i += 1
      } else {
        result.push(
          <div
            key={`empty${j}`}
            className="mission-image"
            style={{ backgroundColor: 'gray' }}
          />
        )
        j += 1
      }
    }
    return result
  }

  return (
    <div className="banner-image" style={{ width: 52 * width }}>
      {mapMissions()}
    </div>
  )
}

export interface BannerImageProps {
  missions: Array<Mission & { index?: number }>
  width: number
  useIndex: boolean
}

export default BannerImage
