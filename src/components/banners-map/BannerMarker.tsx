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
    <CircleMarker
      pathOptions={{
        color: 'rgba(0, 0, 0, 0.4)',
        fillColor: color,
        fillOpacity: 1,
        weight: 8,
        stroke: true,
        className: 'banner-marker',
      }}
      radius={12}
      center={[banner.startLatitude, banner.startLongitude]}
      eventHandlers={{
        click: onSelect,
      }}
      className={selected ? 'selected' : ''}
    >
      <Tooltip permanent={selected}>{banner.title}</Tooltip>
    </CircleMarker>
  )
}

export interface BannerMarkerProps {
  banner: Banner
  selected: boolean
  onSelect: () => any
}

export default BannerMarker
