import { divIcon, Marker as InternalMarker } from 'leaflet'
import React, { FC } from 'react'

import { Marker, Tooltip } from 'react-leaflet'
import { Banner } from '../../features/banner'

interface MarkerWithBanner {
  banner?: Banner
}

export const getBannerFromMarker = (marker: InternalMarker) => {
  return ((marker as unknown) as MarkerWithBanner).banner
}

export const BannerMarker: FC<BannerMarkerProps> = ({
  banner,
  selected,
  onSelect,
}) => {
  const setBanner = (
    marker: (InternalMarker & MarkerWithBanner) | null,
    theBanner: Banner
  ) => {
    // Because of the way Marker is implemented in react-leaflet, I haven't found
    // a way to extend it to be able to assign the data the usual declarative react way.
    // So, we have to use explicit setting of parameter value

    if (marker && banner) {
      // eslint-disable-next-line no-param-reassign
      marker.banner = theBanner
    }
  }

  if (banner.listType === 'blacklist') {
    return null
  }

  const listType = banner.listType ?? 'none'
  const listTypeClassName = listType === 'none' ? '' : `marker-pin-${listType}`

  const iconNormal = divIcon({
    className: `custom-div-icon-${selected}`,
    html: `<div class='marker-pin-medium-${selected} ${listTypeClassName}'></div>`,
    iconAnchor: [0, 0],
  })
  return (
    <Marker
      icon={iconNormal}
      position={[banner.startLatitude, banner.startLongitude]}
      eventHandlers={{
        click: onSelect,
      }}
      ref={(el) => setBanner(el, banner)}
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
