import { LatLng } from 'leaflet'
import React, { FC } from 'react'

import { Rectangle } from 'react-leaflet'

const SquareMarker: FC<SquareMarkerProps> = ({ bounds }) => {
  const color = '#16d4b2'
  return (
    <>
      <Rectangle
        pathOptions={{
          fillColor: color,
          fillOpacity: 1,
          weight: 0,
          fill: true,
          stroke: true,
        }}
        bounds={bounds.toBounds(16)}
      />
      <Rectangle
        pathOptions={{
          color: 'rgba(0, 0, 0, 0.4)',
          weight: 4,
          fill: false,
          stroke: true,
        }}
        bounds={bounds.toBounds(19)}
      />
    </>
  )
}

export interface SquareMarkerProps {
  bounds: LatLng
}

export default SquareMarker
