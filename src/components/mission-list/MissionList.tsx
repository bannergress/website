import React, { Fragment } from 'react'

import { Row, Layout, Button } from 'antd'

import { Mission } from '../../features/banner/types'
import MissionCard from '../mission-card'

// import StepCard from '../mission-card'

export class MissionList extends React.Component<MissionListProps, {}> {
  componentDidMount() {}

  render() {
    const { missions } = this.props
    if (missions && missions.length > 0) {
      return (
        <Fragment>
          <Row justify="center">
            <Layout>
              <div className="p-1">
                <Row justify="space-between" className="pr-1">
                  <h2>Missions in this banner</h2>
                  <Button>Expand all</Button>
                </Row>

                <Row justify="center">
                  {missions.map((missionItem: Mission) => (
                    <MissionCard mission={missionItem} key={missionItem.id} />
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
}

export default MissionList
