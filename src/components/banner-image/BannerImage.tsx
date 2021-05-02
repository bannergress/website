import React, { FC } from 'react'

import { Mission } from '../../features/mission'
import MissionImage from '../mission-image/MissionImage'

import './banner-image.less'

const BannerImage: FC<BannerImageProps> = ({ missions, width }) => {
  return (
    <div className="banner-image" style={{ width: 52 * width }}>
      {missions.map((m) => (
        <MissionImage key={m.id} mission={m} />
      ))}
    </div>
  )
}

export interface BannerImageProps {
  missions: Array<Mission>
  width: number
}

export default BannerImage
