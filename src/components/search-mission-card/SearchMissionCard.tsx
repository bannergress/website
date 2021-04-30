import React, { FC } from 'react'

import { Mission } from '../../features/mission'
import MissionImage from '../mission-image/MissionImage'

import './search-mission-card.less'

const SearchMissionCard: FC<SearchMissionCardProps> = ({
  mission,
  onSelectMission,
  icon,
}) => {
  return (
    <div className="search-mission-card">
      <MissionImage mission={mission} />
      <div className="mission-title">{mission?.title}</div>
      <button
        type="button"
        onClick={() => onSelectMission(mission)}
        onKeyPress={() => onSelectMission(mission)}
        className="mission-button"
        tabIndex={0}
      >
        {icon}
      </button>
    </div>
  )
}

export interface SearchMissionCardProps {
  mission: Mission
  onSelectMission: (mission: Mission) => void
  icon: JSX.Element
}

export default SearchMissionCard
