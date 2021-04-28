import React, { Fragment } from 'react'
import { Card, Row } from 'antd'
import { ReactComponent as SVGChevron } from '../../img/icons/chevron.svg'

import StepList from '../step-list'
import { Mission } from '../../features/mission'

import './mission-card.less'

class MissionCard extends React.Component<MissionCardProps, MissionCardState> {
  constructor(props: MissionCardProps) {
    super(props)
    this.state = {
      expanded: props.expanded,
      expandedFromProps: props.expanded,
    }
  }

  static getDerivedStateFromProps(
    nextProps: MissionCardProps,
    state: MissionCardState
  ): MissionCardState {
    return {
      expanded:
        nextProps.expanded === state.expandedFromProps
          ? state.expanded
          : nextProps.expanded,
      expandedFromProps: nextProps.expanded,
    }
  }

  onExpand = () => {
    const { expanded } = this.state
    this.setState({ expanded: !expanded })
  }

  render() {
    const { mission, showExpandOption } = this.props
    const { expanded } = this.state
    return (
      <Fragment>
        <div className="mission-card" key={mission?.id}>
          <Card style={{ width: 448, backgroundColor: '#404040' }}>
            <Row
              align="middle"
              justify="space-between"
              className="mission-content"
              onClick={this.onExpand}
            >
              <div>
                <Row align="middle">
                  <div
                    className="mission-circle"
                    color="#000"
                    title={mission?.title}
                    key={mission?.id}
                    style={{
                      backgroundImage: `url('${mission?.picture}')`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '100%',
                    }}
                  />
                  <div className="mission-title">{mission?.title}</div>
                </Row>
              </div>
              {showExpandOption && (
                <div>
                  <SVGChevron
                    fill="#FFF"
                    className={`icon ${expanded ? 'open' : ''}`}
                    key="showpanel"
                  />
                </div>
              )}
            </Row>
            {expanded ? <StepList steps={mission?.steps} /> : null}
          </Card>
        </div>
      </Fragment>
    )
  }
}

export interface MissionCardProps {
  mission: Mission | undefined
  expanded: boolean
  showExpandOption: boolean
}

interface MissionCardState {
  expanded: boolean
  expandedFromProps: boolean
}

export default MissionCard
