import React, { FC } from 'react'

import MissionImage from '../mission-image/MissionImage'

const PlaceHolderMission: FC<PlaceHolderMissionProps> = ({
  index,
  className,
}) => (
  <div className={`search-mission-card ${className}`}>
    <MissionImage />
    <div className="mission-title-and-author">
      <div className="mission-title placeholder">Placeholder {index}</div>
    </div>
  </div>
)

export interface PlaceHolderMissionProps {
  index?: number
  className?: string
}

export default PlaceHolderMission
