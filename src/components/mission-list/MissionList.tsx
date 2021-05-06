import React, { Fragment } from 'react'
import { Row, Layout, Button } from 'antd'

import { NumDictionary } from '../../features/banner'
import { mapMissions, Mission } from '../../features/mission'
import MissionCard from '../mission-card'

import './mission-list.less'

const MissionList: React.FC<MissionListProps> = ({
  missions,
  expanded,
  onExpand,
}) => {
  const renderMission = (mission: Mission | undefined) => {
    if (mission) {
      return (
        <MissionCard
          key={mission.id}
          mission={mission}
          expanded={expanded}
          showExpandOption={onExpand !== undefined}
        />
      )
    }
    return undefined
  }

  if (missions) {
    return (
      <div className="mission-list">
        <div className="mission-list-header">
          <h2>Missions in this banner</h2>
          {onExpand && (
            <Button className="bg-button bg-button-default" onClick={onExpand}>
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
  expanded: boolean
  onExpand?: () => void
}

export default MissionList
