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
  showMissionOrder,
}) => (
  <MapCluster>
    {showMissionStartPointsOnMap(
      banner.missions!,
      openedMissionIndexes,
      banner.type === 'sequential' || Boolean(showMissionOrder),
      onOpenMission
    )}
    {showBannerRouteOnMap(
      banner,
      openedMissionIndexes,
      'green',
      showMissionOrder
    )}
  </MapCluster>
)

export interface MissionStartMarkerListProps {
  banner: Banner
  openedMissionIndexes: Array<number>
  onOpenMission: (index: number) => void
  showMissionOrder?: boolean
}

const areEqual = (
  prevProps: MissionStartMarkerListProps,
  nextProps: MissionStartMarkerListProps
) => {
  return (
    _.isEqual(prevProps.banner, nextProps.banner) &&
    prevProps.showMissionOrder === nextProps.showMissionOrder &&
    _.isEqual(prevProps.openedMissionIndexes, nextProps.openedMissionIndexes)
  )
}

export default React.memo(MissionStartMarkerList, areEqual)
