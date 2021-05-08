import { divIcon, LatLng } from 'leaflet'
import React, { FC } from 'react'

import { Marker } from 'react-leaflet'

const SquareMarker: FC<SquareMarkerProps> = ({ bounds }) => {
  const iconNormal = divIcon({
    className: 'custom-div-icon',
    html: `<div class='square-marker-pin'></div>`,
    iconAnchor: [0, 0],
  })
  return <Marker icon={iconNormal} position={[bounds.lat, bounds.lng]} />
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
  bounds: LatLng
}

export default SquareMarker
