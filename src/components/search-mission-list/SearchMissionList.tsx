import React, { Fragment, FC } from 'react'
import { Col } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'

import { Mission } from '../../features/mission'
import { useInfiniteScroll } from '../../hooks/InfiniteScroll'
import SearchMissionCard from '../search-mission-card'

import './search-mission-list.less'

const SearchMissionList: FC<SearchMissionListProps> = ({
  missions,
  hasMoreMissions,
  initial,
  icon,
  loadMoreMissions,
  onSelectMission,
  missionEditor,
  missionClass,
}) => {
  const [ref] = useInfiniteScroll({
    callback: loadMoreMissions,
  })

  if (missions && missions.length > 0) {
    return (
      <Fragment>
        <Scrollbars className="search-mission-list">
          {missions?.map((mission, index) => (
            <SearchMissionCard
              key={mission.id}
              mission={mission}
              icon={icon}
              onSelectMission={onSelectMission}
              missionEditor={() =>
                missionEditor ? missionEditor(mission, index) : <></>
              }
              className={missionClass ? missionClass(mission) : ''}
            />
          ))}
          {hasMoreMissions && <div ref={ref}>Loading more items...</div>}
        </Scrollbars>
      </Fragment>
    )
  }
  return (
    <Fragment>{hasMoreMissions && !initial && <Col>Loading...</Col>}</Fragment>
  )
}

export interface SearchMissionListProps {
  missions: Array<Mission & { index?: number }> | undefined
  hasMoreMissions: Boolean
  icon: JSX.Element
  initial?: boolean
  loadMoreMissions?: () => Promise<void>
  onSelectMission: (mission: Mission & { index?: number }) => void
  missionEditor?: (
    mission: Mission & { index?: number },
    pos: number
  ) => JSX.Element | undefined
  missionClass?: (mission: Mission & { index?: number }) => string
}

export default SearchMissionList
