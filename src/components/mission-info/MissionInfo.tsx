import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import {
  Mission,
  createMissionIntelLink,
  createMissionScannerLink,
} from '../../features/mission'
import { getExternalLinkAttributes } from '../../features/utils'
import { Duration } from '../duration/Duration'
import { Distance } from '../distance/Distance'

import SVGExplorer from '../../assets/img/icons/explorer.svg?react'
import SVGTimer from '../../assets/img/icons/timer.svg?react'
import SVGIntel from '../../assets/img/icons/intel.svg?react'

import './mission-info.less'
import { isMobile } from '../../features/utils/os'

const MissionList: React.FC<MissionInfoProps> = ({ mission }) => {
  const { t } = useTranslation()

  return (
    <div className="mission-info">
      {mission.status !== 'published' && (
        <div className="mission-info-markedoffline">
          {t('missions.markedOffline')}
        </div>
      )}
      <div className="mission-info-intel">
        <a
          {...getExternalLinkAttributes()}
          href={createMissionIntelLink(mission.id)}
        >
          <SVGIntel fill="currentColor" />
          {t('missions.viewOnIntel')}
        </a>
        {isMobile() && (
          <a
            {...getExternalLinkAttributes()}
            href={createMissionScannerLink(mission.id)}
          >
            <SVGIntel fill="currentColor" />
            {t('missions.viewInScanner')}
          </a>
        )}
      </div>
      <div className="mission-info-stats">
        <div className="mission-info-logo-and-text">
          <div>
            <SVGExplorer fill="currentColor" />
          </div>
          <div>
            {mission.lengthMeters ? (
              <Distance distanceMeters={mission.lengthMeters} />
            ) : (
              t('missingData')
            )}
          </div>
        </div>
        <div className="mission-info-logo-and-text">
          <div>
            <SVGTimer />
          </div>
          <div>
            {mission.averageDurationMilliseconds ? (
              <Duration
                durationMilliseconds={mission.averageDurationMilliseconds || 0}
              />
            ) : (
              t('missingData')
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export interface MissionInfoProps {
  mission: Mission
}

export default MissionList
