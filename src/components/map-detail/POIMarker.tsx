import { divIcon } from 'leaflet'
import React, { FC } from 'react'
import { Marker, Tooltip } from 'react-leaflet'

import { FieldTripWaypointPOI, PortalPOI } from '../../features/mission'

const POIMarker: FC<POIMarkerProps> = ({ poi }) => {
  const iconNormal = divIcon({
    className: 'custom-div-poi-icon',
    html: `<div class='marker-poi-pin'></div>`,
    iconAnchor: [0, 0],
  })
  return (
    <Marker icon={iconNormal} position={[poi.latitude, poi.longitude]}>
      <Tooltip offset={[20, 0]}>{poi.title}</Tooltip>
    </Marker>
  )
}

export interface POIMarkerProps {
  poi: PortalPOI | FieldTripWaypointPOI
}

export default POIMarker
