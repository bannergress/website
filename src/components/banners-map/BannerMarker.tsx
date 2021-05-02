import React, { FC } from 'react'

import { CircleMarker, Tooltip } from 'react-leaflet'
import { Banner } from '../../features/banner'

const BannerMarker: FC<BannerMarkerProps> = ({
  banner,
  selected,
  onSelect,
}) => {
  const color = selected ? '#16d4b2' : '#6832da'
  return (
    <>
      <CircleMarker
        pathOptions={{
          fillColor: color,
          fillOpacity: 1,
          fill: true,
          stroke: false,
        }}
        radius={12}
        center={[banner.startLatitude, banner.startLongitude]}
        eventHandlers={{
          click: onSelect,
        }}
      >
        <Tooltip permanent={selected}>{banner.title}</Tooltip>
      </CircleMarker>
      <CircleMarker
        pathOptions={{
          color: 'rgba(0, 0, 0, 0.4)',
          weight: 8,
          fill: false,
          stroke: true,
        }}
        radius={16}
        center={[banner.startLatitude, banner.startLongitude]}
        eventHandlers={{
          click: onSelect,
        }}
      >
        <Tooltip permanent={selected}>{banner.title}</Tooltip>
      </CircleMarker>
    </>
  )
}

export interface BannerMarkerProps {
  banner: Banner
  selected: boolean
  onSelect: () => any
}

export default BannerMarker
