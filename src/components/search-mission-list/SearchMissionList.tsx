import React, { Fragment, FC } from 'react'
import { Col } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import { Trans, useTranslation } from 'react-i18next'

import { Mission } from '../../features/mission'
import { useInfiniteScroll } from '../../hooks/InfiniteScroll'
import SearchMissionCard from '../search-mission-card'
import LoadingOverlay from '../loading-overlay'

import './search-mission-list.less'

const SearchMissionList: FC<SearchMissionListProps> = ({
  missions,
  hasMoreMissions,
  initial,
  icon,
  loadMoreMissions,
  onSelectMission,
  onMissionAuthorClick,
  missionEditor,
  missionClass,
}) => {
  const [ref] = useInfiniteScroll({
    callback: loadMoreMissions,
  })
  const { t } = useTranslation()

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
              onMissionAuthorClick={onMissionAuthorClick}
              missionEditor={() =>
                missionEditor ? missionEditor(mission, index) : <></>
              }
              className={missionClass ? missionClass(mission) : ''}
            />
          ))}
          {hasMoreMissions && (
            <div ref={ref}>
              <Trans i18nKey="loadingMore">Loading more items...</Trans>
            </div>
          )}
        </Scrollbars>
      </Fragment>
    )
  }
  if (!hasMoreMissions && !initial) {
    return (
      <Fragment>
        <Col>
          <Trans i18nKey="missions.notFound">No missions found</Trans>
        </Col>
      </Fragment>
    )
  }
  return (
    <Fragment>
      {hasMoreMissions && !initial && (
        <Col>
          <LoadingOverlay
            active
            spinner
            fadeSpeed={500}
            text={t('missions.searching')}
          />
        </Col>
      )}
    </Fragment>
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
  onMissionAuthorClick?: (author: string) => void
}

export default SearchMissionList
