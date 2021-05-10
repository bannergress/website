import { divIcon, LatLng } from 'leaflet'
import React, { FC } from 'react'

import { Marker } from 'react-leaflet'

const SquareMarker: FC<SquareMarkerProps> = ({ coords, color, children }) => {
  const iconNormal = divIcon({
    className: 'custom-div-icon-true',
    html: `<div class="square-marker-pin color-${color}">🏁</div>`,
    iconAnchor: [0, 0],
  })
  return (
    <Marker icon={iconNormal} position={[coords.lat, coords.lng]}>
      {children}
    </Marker>
  )
}

export interface SquareMarkerProps {
  coords: LatLng
  color: 'green' | 'blue'
}

export default SquareMarker
