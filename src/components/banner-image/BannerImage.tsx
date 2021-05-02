import React, { FC } from 'react'

import { Mission } from '../../features/mission'
import MissionImage from '../mission-image/MissionImage'

import './banner-image.less'

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
