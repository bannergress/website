import React, { FC } from 'react'

import { isPlaceholder, Mission } from '../../features/mission'
import { getSizedImageUrl } from '../../features/utils'

import './mission-image.less'

const MissionImage: FC<MissionImageProps> = ({ mission }) => {
  return (
    <div
      className="mission-image"
      title={mission?.title}
      style={{
        backgroundImage: `url('${getSizedImageUrl(
          mission?.picture,
          50,
          true
        )}')`,
      }}
    >
      {isPlaceholder(mission) ? '?' : ''}
    </div>
  )
}

export interface MissionImageProps {
  mission: Mission
}

export default MissionImage
