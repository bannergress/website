import React, { Fragment, useEffect, useRef } from 'react'
import { Row, Layout, Button } from 'antd'

import { NumDictionary } from '../../features/banner'
import { mapMissions, Mission } from '../../features/mission'
import MissionCard from '../mission-card'

import './mission-list.less'

const MissionList: React.FC<MissionListProps> = ({
  missions,
  expandedMissionIndexes = [],
  expanded,
  scrollMissionIndex,
  onExpand,
  onExpandAll,
}) => {
  const itemsRef = useRef<Array<HTMLDivElement | null>>([])

  const renderMission = (mission: Mission | undefined, index: number) => {
    if (mission) {
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
          <h2>Missions in this banner</h2>
          {onExpand && (
            <Button
              className="bg-button bg-button-default"
              onClick={onExpandAll}
            >
              {expanded ? 'Collapse all' : 'Expand all'}
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
          <div>Loading...</div>
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
