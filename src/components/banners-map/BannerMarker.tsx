import { divIcon } from 'leaflet'
import React, { FC } from 'react'

import { Marker, Tooltip } from 'react-leaflet'
import { Banner } from '../../features/banner'

const BannerMarker: FC<BannerMarkerProps> = ({
  banner,
  selected,
  onSelect,
}) => {
  const iconNormal = divIcon({
    className: `custom-div-icon-${selected}`,
    html: `<div class='marker-pin-${selected}'></div>`,
    iconAnchor: [0, 0],
  })
  return (
    <Marker
      icon={iconNormal}
      position={[banner.startLatitude, banner.startLongitude]}
      eventHandlers={{
        click: onSelect,
      }}
    >
      <Tooltip permanent={selected} offset={[20, 0]}>
        {banner.title}
      </Tooltip>
    </Marker>
  )
}

export interface BannerMarkerProps {
  banner: Banner
  selected: boolean
  onSelect: () => void
}

export default BannerMarker
