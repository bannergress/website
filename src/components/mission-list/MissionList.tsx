import React, { Fragment } from 'react'

import { Row, Layout, Button } from 'antd'

import { Mission } from '../../features/banner'
import MissionCard from '../mission-card'

export class MissionList extends React.Component<MissionListProps, {}> {
  componentDidMount() {}

  render() {
    const { missions, expanded, onExpand } = this.props
    if (missions && missions.length > 0) {
      return (
        <Fragment>
          <Row justify="center">
            <Layout>
              <div className="p-1">
                <Row justify="space-between" className="pr-1">
                  <h2>Missions in this banner</h2>
                  <Button onClick={onExpand}>
                    {expanded ? 'Collapse all' : 'Expand all'}
                  </Button>
                </Row>

                <Row justify="center">
                  {missions.map((missionItem: Mission) => (
                    <MissionCard
                      key={missionItem.id}
                      mission={missionItem}
                      expanded={expanded}
                    />
                  ))}
                </Row>
              </div>
            </Layout>
          </Row>
        </Fragment>
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
  missions: Array<Mission>
  expanded: boolean
  onExpand: () => void
}

export default MissionList
