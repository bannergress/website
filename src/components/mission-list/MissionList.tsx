import React, { Fragment } from 'react'
import { Row, Layout, Button } from 'antd'

import { NumDictionary } from '../../features/banner'
import { mapMissions, Mission } from '../../features/mission'
import MissionCard from '../mission-card'

import './mission-list.less'

export class MissionList extends React.Component<MissionListProps, {}> {
  componentDidMount() {}

  renderMission = (mission: Mission | undefined) => {
    const { expanded, onExpand } = this.props
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

  render() {
    const { missions, expanded, onExpand } = this.props
    if (missions) {
      return (
        <div>
          <div>
            <h2>Missions in this banner</h2>
            {onExpand && (
              <Button
                className="bg-button bg-button-default"
                onClick={onExpand}
              >
                {expanded ? 'Collapse all' : 'Expand all'}
              </Button>
            )}
          </div>
          <div>{mapMissions(missions, this.renderMission)}</div>
        </div>
      )
    }
    return (
      <Fragment>
        <Row justify="center">
          <Layout>
            <div>Loading</div>
          </Layout>
        </Row>
      </Fragment>
    )
  }
}

export interface MissionListProps {
  missions: NumDictionary<Mission>
  expanded: boolean
  onExpand?: () => void
}

export default MissionList
