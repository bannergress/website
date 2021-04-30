import React, { FC } from 'react'

import { Mission } from '../../features/mission'

import './banner-image.less'
import MissionImage from '../mission-image/MissionImage'

const BannerImage: FC<BannerImageProps> = ({ missions }) => {
  return (
    <div className="banner-image">
      {missions.map((m) => (
        <MissionImage key={m.id} mission={m} />
      ))}
    </div>
  )
}

export interface BannerImageProps {
  missions: Array<Mission>
}

export default BannerImage
