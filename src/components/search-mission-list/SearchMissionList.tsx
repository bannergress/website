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
  loadMoreMissions,
  onSelectMission,
  icon,
  initial,
}) => {
  const [ref] = useInfiniteScroll({
    callback: loadMoreMissions,
  })

  if (missions && missions.length > 0) {
    return (
      <Fragment>
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={800}
          className="search-mission-list"
        >
          {missions?.map((mission) => (
            <SearchMissionCard
              key={mission.id}
              mission={mission}
              icon={icon}
              onSelectMission={onSelectMission}
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
  missions: Array<Mission> | undefined
  hasMoreMissions: Boolean
  icon: JSX.Element
  initial?: boolean
  loadMoreMissions?: () => Promise<void>
  onSelectMission: (mission: Mission) => void
}

export default SearchMissionList
