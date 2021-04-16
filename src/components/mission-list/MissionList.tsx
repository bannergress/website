import React, { Fragment } from 'react'

import { Row, Layout, Button } from 'antd'

import { Mission, NumDictionary } from '../../features/banner'
import MissionCard from '../mission-card'

export class MissionList extends React.Component<MissionListProps, {}> {
  componentDidMount() {}

  renderMissions = () => {
    const { missions, numberOfMissions, expanded } = this.props
    const result: Array<JSX.Element> = []
    for (let i = 1; i <= numberOfMissions; i += 1) {
      result.push(
        <MissionCard
          key={missions[i].id}
          mission={missions[i]}
          expanded={expanded}
        />
      )
    }
    return result
  }

  render() {
    const { missions, expanded, onExpand } = this.props
    if (missions) {
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

                <Row justify="center">{this.renderMissions()}</Row>
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
  missions: NumDictionary<Mission>
  numberOfMissions: number
  expanded: boolean
  onExpand: () => void
}

export default MissionList
