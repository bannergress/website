import React, { FC } from 'react'

import { Mission } from '../../features/mission'
import MissionImage from '../mission-image/MissionImage'

import './search-mission-card.less'

const SearchMissionCard: FC<SearchMissionCardProps> = ({
  mission,
  icon,
  onSelectMission,
  missionEditor,
}) => {
  return (
    <div className="search-mission-card">
      <MissionImage mission={mission} />
      <div className="mission-title">{mission?.title}</div>
      {missionEditor && missionEditor()}
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
  mission: Mission & { index?: number }
  onSelectMission: (mission: Mission & { index?: number }) => void
  icon: JSX.Element
  missionEditor?: () => JSX.Element
}

export default SearchMissionCard
