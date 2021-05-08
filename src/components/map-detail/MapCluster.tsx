import { divIcon } from 'leaflet'
import React, { FC } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'

const POIMarker: FC<POIMarkerProps> = ({ children }) => {
  const createClusterCustomIcon = (cluster: any) => {
    const numberMarkers = cluster.getChildCount()
    if (numberMarkers > 1) {
      let label = `M${numberMarkers}`
      const innerLabels: Array<any> = cluster
        .getAllChildMarkers()
        .map((m: any) => {
          let { options } = m
          while (options.icon) {
            options = options.icon.options
          }
          if (options.className === 'custom-div-icon') {
            return options.html.match(/>(\d+)/)[1]
          }
          return undefined
        })
        .filter((m: any) => m !== undefined)
      if (innerLabels && innerLabels.length > 0 && innerLabels.length < 3) {
        label = innerLabels.reverse().join('|') as string
      }
      return divIcon({
        className: 'custom-div-icon',
        html: `<div class='marker-pin-false'>${label}</div>`,
        iconAnchor: [0, 0],
      })
    }
    let { options } = cluster.getAllChildMarkers()[0]
    while (options.icon) {
      options = options.icon.options
    }
    return divIcon({
      ...options,
    })
  }
  return (
    <MarkerClusterGroup
      maxClusterRadius="10"
      singleMarkerMode
      iconCreateFunction={createClusterCustomIcon}
    >
      {children}
    </MarkerClusterGroup>
  )
}

export interface POIMarkerProps {
  children: React.ReactNode
}

export default POIMarker
