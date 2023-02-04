import { LatLng } from 'leaflet'
import React, { FC } from 'react'
import { Marker } from 'react-leaflet'
import { EndMarkerData, setMarkerData } from './MarkerData'
import { getMarkerDataIcon } from './MarkerIcons'

const SquareMarker: FC<SquareMarkerProps> = ({
  coords,
  color,
  pane,
  children,
}) => {
  const markerData: EndMarkerData = { markerType: 'end' }
  const colorClassName = `color-${color}`
  const icon = getMarkerDataIcon(markerData, colorClassName)

  if (coords) {
    return (
      <Marker
        icon={icon}
        position={[coords.lat, coords.lng]}
        ref={(el) => setMarkerData(el, markerData)}
        pane={pane || 'markerPane'}
      >
        {children}
      </Marker>
    )
  } else {
    return <></>
  }
}

export interface SquareMarkerProps {
  coords: LatLng
  color: 'green' | 'blue'
  pane?: string
}

export default SquareMarker
