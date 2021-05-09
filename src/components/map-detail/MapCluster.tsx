import { divIcon } from 'leaflet'
import React, { FC } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'

const createClusterLabel = (labels: string[], ordered: boolean): string => {
  let hasFirstMission
  let hasFinish
  let otherMissions: string[]
  if (ordered) {
    otherMissions = []
    labels.reverse().forEach((label) => {
      switch (label) {
        case '1':
          hasFirstMission = true
          break
        case '🏁':
          hasFinish = true
          break
        default:
          otherMissions.push(label)
          break
      }
    })
  } else {
    hasFirstMission = false
    hasFinish = false
    otherMissions = labels
  }
  const labelComponents = [
    ...(hasFirstMission ? ['1'] : []),
    ...(labels.length > 2 ? [`×${otherMissions.length}`] : otherMissions),
    ...(hasFinish ? ['🏁'] : []),
  ]
  const result = labelComponents.join('<br>')
  return result
}

const POIMarker: FC<POIMarkerProps> = ({ children }) => {
  const createClusterCustomIcon = (cluster: any) => {
    const numberMarkers = cluster.getChildCount()
    if (numberMarkers > 1) {
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
      const label = createClusterLabel(innerLabels, true)
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
