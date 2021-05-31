import React, { FC, useMemo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import { POIMarkerData, setMarkerData } from './MarkerData'
import { getMarkerDataIcon } from './MarkerIcons'

import { AvailablePOI } from '../../features/mission'

const POIMarker: FC<POIMarkerProps> = ({ poi }) => {
  return useMemo(() => {
    const markerData: POIMarkerData = { markerType: 'poi', poi }
    const icon = getMarkerDataIcon(markerData)
    return (
      <Marker
        icon={icon}
        position={[poi.latitude, poi.longitude]}
        ref={(el) => setMarkerData(el, markerData)}
        pane="poi"
      >
        <Tooltip offset={[20, 0]} pane="tooltipPane">
          {poi.title}
        </Tooltip>
      </Marker>
    )
  }, [poi])
}

export interface POIMarkerProps {
  poi: AvailablePOI
}

export default POIMarker
