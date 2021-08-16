import React, { FC } from 'react'

import { Mission } from '../../features/mission'

import './mission-image.less'

const MissionImage: FC<MissionImageProps> = ({ mission }) => {
  return (
    <div
      className="mission-image"
      title={mission?.title}
      style={{ backgroundImage: `url('${mission?.picture}')` }}
    >
      {mission?.id ? '' : '?'}
    </div>
  )
}

export interface MissionImageProps {
  mission?: Mission
}

export default MissionImage
