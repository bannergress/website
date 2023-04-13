import React, { FC } from 'react'
import _ from 'underscore'

import { Banner } from '../../features/banner'
import { showMissionStartPointsOnMap } from './showMissionsOnMap'
import MapCluster from './MapCluster'
import { showBannerRouteOnMap } from './showBannerRouteOnMap'

const MissionStartMarkerList: FC<MissionStartMarkerListProps> = ({
  banner,
  openedMissionIndexes,
  onOpenMission,
}) => (
  <MapCluster>
    {showMissionStartPointsOnMap(
      banner.missions!,
      openedMissionIndexes,
      banner.type === 'sequential',
      onOpenMission
    )}
    {showBannerRouteOnMap(banner, openedMissionIndexes, 'green')}
  </MapCluster>
)

export interface MissionStartMarkerListProps {
  banner: Banner
  openedMissionIndexes: Array<number>
  onOpenMission: (index: number) => void
}

const areEqual = (
  prevProps: MissionStartMarkerListProps,
  nextProps: MissionStartMarkerListProps
) => {
  return (
    _.isEqual(prevProps.banner, nextProps.banner) &&
    _.isEqual(prevProps.openedMissionIndexes, nextProps.openedMissionIndexes)
  )
}

export default React.memo(MissionStartMarkerList, areEqual)
