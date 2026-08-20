import React, { FC } from 'react'
import { Button } from 'antd'

import { Mission, createMissionIntelLink } from '../../features/mission'
import { getExternalLinkAttributes } from '../../features/utils'
import { Agent } from '../agent/Agent'
import MissionImage from '../mission-image/MissionImage'
import PlaceHolderMission from './PlaceHolderMission'
import SVGIntel from '../../assets/img/icons/intel.svg?react'

import './search-mission-card.less'

const getMissionIntelLink = (mission: Mission) => {
  if (mission.id) {
    return (
      <a
        {...getExternalLinkAttributes()}
        href={createMissionIntelLink(mission.id)}
        tabIndex={-1}
      >
        <SVGIntel />
      </a>
    )
  }
  return undefined
}

const SearchMissionCard: FC<SearchMissionCardProps> = ({
  mission,
  icon,
  className,
  onSelectMission,
  onMissionAuthorClick,
  missionEditor,
}) => {
  if (mission.id.startsWith('placeholder')) {
    return (
      <PlaceHolderMission
        mission={mission}
        missionEditor={missionEditor}
        className={className}
      />
    )
  }
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
            tabIndex={-1}
          >
            <Agent agent={mission.author} linkToAgentProfile={false} />
          </Button>
        )}
      </div>
      {missionEditor && missionEditor()}
      {getMissionIntelLink(mission)}
      <Button
        onClick={() => onSelectMission(mission)}
        className="mission-button"
        tabIndex={-1}
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
