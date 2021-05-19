import React, { FC } from 'react'
import { useLeafletContext } from '@react-leaflet/core'

import { NumDictionary } from '../../features/banner'
import { Mission } from '../../features/mission'
import { getMissionPortalsAndRoutes } from './showMissionsOnMap'
import MissionRoute from './MissionRoute'
import POIMarker from './POIMarker'

const MissionPoiMarkerList: FC<MissionPoiMarkerListProps> = ({
  missions,
  openedMissionIndexes,
}) => {
  const ctx = useLeafletContext()
  const { map } = ctx
  const zoom = map.getZoom()

  if (zoom < 14) {
    return <></>
  }

  const [lines, pois] = getMissionPortalsAndRoutes(
    missions,
    openedMissionIndexes,
    map.getBounds()
  )

  return (
    <>
      {lines.map((l) => (
        <MissionRoute
          key={l.key}
          options={l.options}
          route={l.route}
          title={l.title}
        />
      ))}
      {pois.map((step) => (
        <POIMarker key={step.poi.id} poi={step.poi} />
      ))}
    </>
  )
}

export interface MissionPoiMarkerListProps {
  missions: NumDictionary<Mission>
  openedMissionIndexes: Array<number>
}

export default MissionPoiMarkerList
