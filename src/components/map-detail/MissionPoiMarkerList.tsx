import React, { FC, useEffect, useMemo, useState } from 'react'
import { useLeafletContext } from '@react-leaflet/core'

import { NumDictionary } from '../../features/banner'
import { AvailableStep, Mission } from '../../features/mission'
import { getMissionPortalsAndRoutes, Line } from './showMissionsOnMap'
import MissionRoute from './MissionRoute'
import POIMarker from './POIMarker'

const MissionPoiMarkerList: FC<MissionPoiMarkerListProps> = ({
  missions,
  openedMissionIndexes,
}) => {
  const ctx = useLeafletContext()
  const { map } = ctx
  const [zoom, setZoom] = useState(map.getZoom())
  const [lines, setLines] = useState<Array<Line>>([])
  const [pois, setPois] = useState<Array<AvailableStep>>([])

  useEffect(() => {
    map.addEventListener('zoom', (e) => setZoom(e.target.getZoom()))
    if (zoom >= 14) {
      const [l, p] = getMissionPortalsAndRoutes(
        missions,
        openedMissionIndexes,
        map.getBounds()
      )
      setLines(l)
      setPois(p)
    }
  }, [map, zoom, missions, openedMissionIndexes])

  return useMemo(() => {
    if (zoom < 14) {
      return <></>
    }
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
  }, [zoom, lines, pois])
}

export interface MissionPoiMarkerListProps {
  missions: NumDictionary<Mission>
  openedMissionIndexes: Array<number>
}

export default MissionPoiMarkerList
