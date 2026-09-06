import React, { Fragment, useEffect, useRef } from 'react'
import { Row, Layout, Button } from 'antd'
import { useTranslation } from 'react-i18next'

import { NumDictionary } from '../../features/banner'
import { mapMissions, Mission } from '../../features/mission'
import MissionCard from '../mission-card'

import './MissionList.scss'

const MissionList: React.FC<MissionListProps> = ({
  missions,
  expandedMissionIndexes = [],
  expanded,
  scrollMissionIndex,
  onExpand,
  onExpandAll,
}) => {
  const itemsRef = useRef<Array<HTMLDivElement | null>>([])
  const { t } = useTranslation()

  const createEmptyMission = (sequence?: number) => {
    return {
      id: `missing_${sequence}`,
      title: `Missing Mission ${sequence}`,
      picture: '',
    }
  }

  const renderMission = (
    mission: Mission | undefined,
    index: number,
    sequence?: number
  ) => {
    if (mission && mission.id) {
      return (
        <MissionCard
          key={mission.id}
          mission={mission}
          expanded={expandedMissionIndexes.includes(index)}
          onExpand={() => onExpand && onExpand(index)}
          onRef={(el) => {
            itemsRef.current[index] = el
          }}
        />
      )
    }

    if (mission) {
      return (
        <MissionCard
          key={`missing_${sequence}`}
          mission={createEmptyMission(sequence)}
          expanded={false}
        />
      )
    }

    return undefined
  }

  useEffect(() => {
    if (
      scrollMissionIndex !== undefined &&
      itemsRef.current[scrollMissionIndex]
    ) {
      setTimeout(() => {
        itemsRef.current[scrollMissionIndex]!.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 1)
    }
  }, [scrollMissionIndex])

  if (missions) {
    return (
      <div className="mission-list">
        <div className="mission-list-header">
          <h2>{t('missions.inBanner')}</h2>
          {onExpand && (
            <Button
              className="bg-button bg-button-default"
              onClick={onExpandAll}
            >
              {expanded ? t('buttons.collapseAll') : t('buttons.expandAll')}
            </Button>
          )}
        </div>
        <div className="mt-1" />
        <div className="mission-list-body">
          {mapMissions(missions, renderMission)}
        </div>
      </div>
    )
  }
  return (
    <Fragment>
      <Row justify="center">
        <Layout>
          <div>{t('loading')}</div>
        </Layout>
      </Row>
    </Fragment>
  )
}

export interface MissionListProps {
  missions: NumDictionary<Mission>
  expandedMissionIndexes?: Array<number>
  expanded: boolean
  scrollMissionIndex?: number
  onExpand?: (index: number) => void
  onExpandAll?: () => void
}

export default MissionList
