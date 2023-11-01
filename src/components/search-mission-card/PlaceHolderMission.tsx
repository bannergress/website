import React, { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Mission } from '../../features/mission'
import MissionImage from '../mission-image/MissionImage'

const PlaceHolderMission: FC<PlaceHolderMissionProps> = ({
  mission,
  className,
  missionEditor,
}) => {
  const { t } = useTranslation()
  return (
    <div className={`search-mission-card placeholder-card ${className}`}>
      <MissionImage mission={mission} />
      <div className="mission-title-and-author">
        <div className="mission-title placeholder">
          {t('missions.placeholder', { index: mission.index })}
        </div>
      </div>
      {missionEditor && missionEditor()}
    </div>
  )
}

export interface PlaceHolderMissionProps {
  mission: Mission & { index?: number }
  className?: string
  missionEditor?: () => JSX.Element | undefined
}

export default PlaceHolderMission
