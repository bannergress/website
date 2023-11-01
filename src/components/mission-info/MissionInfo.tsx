import React from 'react'
import { Trans } from 'react-i18next'

import {
  Mission,
  createMissionIntelLink,
  createMissionScannerLink,
} from '../../features/mission'
import { getExternalLinkAttributes } from '../../features/utils'
import { Duration } from '../duration/Duration'
import { Distance } from '../distance/Distance'

import SVGExplorer from '../../img/icons/explorer.svg?react'
import SVGTimer from '../../img/icons/timer.svg?react'
import SVGIntel from '../../img/icons/intel.svg?react'

import './mission-info.less'
import { isMobile } from '../../features/utils/os'

const MissionList: React.FC<MissionInfoProps> = ({ mission }) => {
  return (
    <div className="mission-info">
      {mission.status !== 'published' && (
        <div className="mission-info-markedoffline">
          <Trans i18nKey="missions.markedOffline">
            Mission marked as offline
          </Trans>
        </div>
      )}
      <div className="mission-info-intel">
        <a
          {...getExternalLinkAttributes()}
          href={createMissionIntelLink(mission.id)}
        >
          <SVGIntel fill="currentColor" />
          <Trans i18nKey="missions.viewOnIntel">View on Intel</Trans>
        </a>
        {isMobile() && (
          <a
            {...getExternalLinkAttributes()}
            href={createMissionScannerLink(mission.id)}
          >
            <SVGIntel fill="currentColor" />
            <Trans i18nKey="missions.viewInScanner">View in Scanner</Trans>
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
              <Trans i18nKey="missingData">???</Trans>
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
              <Trans i18nKey="missingData">???</Trans>
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
