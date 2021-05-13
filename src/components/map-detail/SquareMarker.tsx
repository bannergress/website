import { divIcon, LatLng } from 'leaflet'
import React, { FC } from 'react'
import { Marker } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server'

import { ReactComponent as CheckeredFlagSVG } from '../../img/icons/checkered-flag.svg'

const SquareMarker: FC<SquareMarkerProps> = ({ coords, color, children }) => {
  const markerContents = renderToStaticMarkup(
    <div className={`square-marker-pin color-${color}`}>
      <CheckeredFlagSVG />
    </div>
  )
  const iconNormal = divIcon({
    className: 'custom-div-icon-true',
    html: markerContents,
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
