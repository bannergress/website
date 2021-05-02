import React from 'react'

import { Mission } from '../../features/mission'
import MissionImage from '../mission-image/MissionImage'
import StepList from '../step-list'
import { ReactComponent as SVGChevron } from '../../img/icons/chevron.svg'

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
    const { showExpandOption } = this.props
    const { expanded } = this.state
    if (showExpandOption) {
      this.setState({ expanded: !expanded })
    }
  }

  render() {
    const { mission, showExpandOption } = this.props
    const { expanded } = this.state
    return (
      <div className="mission-card" key={mission?.id}>
        <button
          className="mission-header"
          onClick={this.onExpand}
          type="button"
        >
          {mission && <MissionImage mission={mission} />}
          <div className="mission-title">{mission?.title}</div>
          {showExpandOption && (
            <div>
              <SVGChevron
                fill="#FFF"
                className={`icon ${expanded ? 'open' : ''}`}
                key="showpanel"
              />
            </div>
          )}
        </button>
        {expanded && <StepList steps={mission?.steps} />}
      </div>
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
