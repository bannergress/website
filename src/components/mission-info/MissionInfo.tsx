import React from 'react'
import { Trans } from 'react-i18next'

import { Mission, createMissionIntelLink } from '../../features/mission'
import { getExternalLinkAttributes } from '../../features/utils'
import { Duration } from '../duration/Duration'
import { Distance } from '../distance/Distance'

import { ReactComponent as SVGExplorer } from '../../img/icons/explorer.svg'
import { ReactComponent as SVGTimer } from '../../img/icons/timer.svg'
import { ReactComponent as SVGIntel } from '../../img/icons/intel.svg'

import './mission-info.less'

const MissionList: React.FC<MissionInfoProps> = ({ mission }) => {
  return (
    <div className="mission-info">
      {!mission.online && (
        <div className="mission-info-markedoffline">
          <Trans i18nKey="missions.markedOffline">
            Mission marked as offline
          </Trans>
        </div>
      )}
      <div className="mission-info-intel mission-info-logo-and-text">
        <div>
          <a
            {...getExternalLinkAttributes()}
            href={createMissionIntelLink(mission.id)}
          >
            <SVGIntel fill="currentColor" />
          </a>
        </div>
        <div>
          <a
            {...getExternalLinkAttributes()}
            href={createMissionIntelLink(mission.id)}
          >
            <Trans i18nKey="missions.viewOnIntel">
              View Mission on Ingress Intel Map
            </Trans>
          </a>
        </div>
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
