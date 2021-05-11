import React, { FC } from 'react'
import { Button } from 'antd'

import { Mission } from '../../features/mission'
import { Agent } from '../agent/Agent'
import MissionImage from '../mission-image/MissionImage'

import './search-mission-card.less'

const SearchMissionCard: FC<SearchMissionCardProps> = ({
  mission,
  icon,
  className,
  onSelectMission,
  onMissionAuthorClick,
  missionEditor,
}) => {
  return (
    <div className={`search-mission-card ${className}`}>
      <MissionImage mission={mission} />
      <div className="mission-title-and-author">
        <div className="mission-title">{mission?.title}</div>
        {mission.author && (
          <Button
            className="mission-agent"
            onClick={() =>
              onMissionAuthorClick && onMissionAuthorClick(mission.author!.name)
            }
          >
            <Agent agent={mission.author} />
          </Button>
        )}
      </div>
      {missionEditor && missionEditor()}
      <Button
        onClick={() => onSelectMission(mission)}
        className="mission-button"
      >
        {icon}
      </Button>
    </div>
  )
}

export interface SearchMissionCardProps {
  mission: Mission & { index?: number }
  icon: JSX.Element
  className: string
  onSelectMission: (mission: Mission & { index?: number }) => void
  onMissionAuthorClick?: (author: string) => void
  missionEditor?: () => JSX.Element | undefined
}

export default SearchMissionCard
