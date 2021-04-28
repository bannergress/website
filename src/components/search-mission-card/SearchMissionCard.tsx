import React, { Fragment, FC } from 'react'
import { Row } from 'antd'

import { Mission } from '../../features/mission'
import { ReactComponent as SVGRightArrow } from '../../img/icons/right_arrow.svg'

import './search-mission-card.less'

const SearchMissionCard: FC<SearchMissionCardProps> = ({
  mission,
  onSelectMission,
  inverse,
}) => {
  return (
    <Fragment>
      <Row className="search-mission-card">
        <div
          className="mission-circle"
          color="#000"
          title={mission?.title}
          style={{
            backgroundImage: `url('${mission?.picture}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
          }}
        />
        <div className="mission-title">{mission?.title}</div>
        <div
          role="button"
          onClick={() => onSelectMission(mission)}
          onKeyPress={() => onSelectMission(mission)}
          className="mission-arrow"
          tabIndex={0}
        >
          <SVGRightArrow
            fill="#FFF"
            className={`icon ${inverse ? 'inverse' : ''}`}
          />
        </div>
      </Row>
    </Fragment>
  )
}

export interface SearchMissionCardProps {
  mission: Mission
  onSelectMission: (mission: Mission) => void
  inverse: boolean
}

export default SearchMissionCard
