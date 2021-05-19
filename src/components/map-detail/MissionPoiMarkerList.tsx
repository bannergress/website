import React, { FC, useMemo } from 'react'
import { useLeafletContext } from '@react-leaflet/core'

import { NumDictionary } from '../../features/banner'
import { Mission } from '../../features/mission'
import { showMissionPortalsAndRoutes } from './showMissionsOnMap'

const MissionPoiMarkerList: FC<MissionPoiMarkerListProps> = ({
  missions,
  openedMissionIndexes,
}) => {
  const ctx = useLeafletContext()
  const { map } = ctx
  const bounds = map.getBounds()
  const zoom = map.getZoom()

  return useMemo(() => {
    if (zoom < 14) {
      return <></>
    }

    return (
      <>{showMissionPortalsAndRoutes(missions, openedMissionIndexes, bounds)}</>
    )
  }, [bounds, zoom, missions, openedMissionIndexes])
}

export interface MissionPoiMarkerListProps {
  missions: NumDictionary<Mission>
  openedMissionIndexes: Array<number>
}

export default MissionPoiMarkerList
