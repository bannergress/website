import React from 'react'

import { Mission } from '../../features/mission'
import MissionImage from '../mission-image/MissionImage'
import StepList from '../step-list'
import { ReactComponent as SVGChevron } from '../../img/icons/chevron.svg'

import './mission-card.less'

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  expanded,
  onExpand,
}) => {
  return (
    <div className="mission-card" key={mission?.id}>
      <button className="mission-header" onClick={onExpand} type="button">
        {mission && <MissionImage mission={mission} />}
        <div className="mission-title">{mission?.title}</div>
        {onExpand && (
          <div>
            <SVGChevron
              fill="#FFF"
              className={`icon ${expanded ? 'open' : ''}`}
              key="showpanel"
            />
          </div>
        )}
      </button>
      {expanded && <StepList steps={mission?.steps} />}
    </div>
  )
}

export interface MissionCardProps {
  mission: Mission | undefined
  expanded: boolean
  onExpand?: () => void
}

export default MissionCard
