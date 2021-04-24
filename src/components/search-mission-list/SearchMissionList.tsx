import React, { Fragment, FC } from 'react'
import { Col } from 'antd'
import './search-mission-list.less'
import { useInfiniteScroll } from '../../hooks/InfiniteScroll'
import { Mission } from '../../features/mission'
import SearchMissionCard from '../search-mission-card'

const SearchMissionList: FC<SearchMissionListProps> = ({
  missions,
  hasMoreMissions,
  loadMoreMissions,
  onSelectMission,
  inverse,
}) => {
  const [ref] = useInfiniteScroll({
    callback: loadMoreMissions,
  })

  if (missions && missions.length > 0) {
    return (
      <Fragment>
        <Col className="search-mission-list">
          {missions?.map((mission) => (
            <SearchMissionCard
              key={mission.id}
              mission={mission}
              inverse={inverse}
              onSelectMission={onSelectMission}
            />
          ))}
          {hasMoreMissions && <div ref={ref}>Loading more items...</div>}
        </Col>
      </Fragment>
    )
  }
  return <Fragment>{hasMoreMissions && <Col>Loading...</Col>}</Fragment>
}

export interface SearchMissionListProps {
  missions: Array<Mission> | undefined
  hasMoreMissions: Boolean
  inverse: boolean
  loadMoreMissions?: () => Promise<void>
  onSelectMission: (mission: Mission) => void
}

export default SearchMissionList
