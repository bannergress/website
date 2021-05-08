import { divIcon, LatLng } from 'leaflet'
import React, { FC } from 'react'

import { Marker } from 'react-leaflet'

const SquareMarker: FC<SquareMarkerProps> = ({ coords, color }) => {
  const iconNormal = divIcon({
    className: 'custom-div-icon',
    html: `<div class="square-marker-pin color-${color}"></div>`,
    iconAnchor: [0, 0],
  })
  return <Marker icon={iconNormal} position={[coords.lat, coords.lng]} />
  // const color = '#16d4b2'
  // // eslint-disable-next-line no-debugger
  // debugger
  // return (
  //   <>
  //     <Rectangle
  //       pathOptions={{
  //         fillColor: color,
  //         fillOpacity: 1,
  //         weight: 0,
  //         fill: true,
  //         stroke: true,
  //       }}
  //       bounds={bounds.toBounds(16)}
  //     />
  //     <Rectangle
  //       pathOptions={{
  //         color: 'rgba(0, 0, 0, 0.4)',
  //         weight: 4,
  //         fill: false,
  //         stroke: true,
  //       }}
  //       bounds={bounds.toBounds(19)}
  //     />
  //   </>
  // )
}

export interface SquareMarkerProps {
  coords: LatLng
  color: 'green' | 'blue'
}

export default SquareMarker
