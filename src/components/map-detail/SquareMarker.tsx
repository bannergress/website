import { LatLng } from 'leaflet'
import React, { FC } from 'react'
import { Marker } from 'react-leaflet'
import { EndMarkerData, setMarkerData } from './MarkerData'
import { getMarkerDataIcon } from './MarkerIcons'

const SquareMarker: FC<SquareMarkerProps> = ({ coords, color, children }) => {
  const markerData: EndMarkerData = { markerType: 'end' }
  const colorClassName = `color-${color}`
  const icon = getMarkerDataIcon(markerData, colorClassName)

  return (
    <Marker
      icon={icon}
      position={[coords.lat, coords.lng]}
      ref={(el) => setMarkerData(el, markerData)}
    >
      {children}
    </Marker>
  )
}

export interface SquareMarkerProps {
  coords: LatLng
  color: 'green' | 'blue'
}

export default SquareMarker
