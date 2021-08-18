import React, { FC } from 'react'

import { isPlaceholder, Mission } from '../../features/mission'

import './mission-image.less'

const MissionImage: FC<MissionImageProps> = ({ mission }) => {
  return (
    <div
      className="mission-image"
      title={mission?.title}
      style={{ backgroundImage: `url('${mission?.picture}')` }}
    >
      {isPlaceholder(mission) ? '?' : ''}
    </div>
  )
}

export interface MissionImageProps {
  mission: Mission
}

export default MissionImage
