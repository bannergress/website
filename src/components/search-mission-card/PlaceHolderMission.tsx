import React, { FC } from 'react'
import { Trans } from 'react-i18next'

import { Mission } from '../../features/mission'
import MissionImage from '../mission-image/MissionImage'

const PlaceHolderMission: FC<PlaceHolderMissionProps> = ({
  mission,
  className,
  missionEditor,
}) => (
  <div className={`search-mission-card placeholder-card ${className}`}>
    <MissionImage mission={mission} />
    <div className="mission-title-and-author">
      <div className="mission-title placeholder">
        <Trans i18nKey="missions.placeholder" values={{ index: mission.index }}>
          Placeholder {{ index: mission.index }}
        </Trans>
      </div>
    </div>
    {missionEditor && missionEditor()}
  </div>
)

export interface PlaceHolderMissionProps {
  mission: Mission & { index?: number }
  className?: string
  missionEditor?: () => JSX.Element | undefined
}

export default PlaceHolderMission
