import { divIcon } from 'leaflet'
import React, { FC } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'

const createClusterLabel = (
  labels: string[],
  ordered: boolean
): [string, boolean] => {
  let hasFirstMission = false
  let hasFinish = false
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
  return [result, hasFirstMission || hasFinish]
}

const getChildOptions = (marker: any) => {
  let { options } = marker
  while (options.icon) {
    options = options.icon.options
  }
  return options
}

const createClusterCustomIcon = (cluster: any) => {
  const numberMarkers = cluster.getChildCount()
  if (numberMarkers > 1) {
    const innerLabels: Array<any> = cluster
      .getAllChildMarkers()
      .map((m: any) => {
        const options = getChildOptions(m)
        if (options.className.includes('custom-div-icon')) {
          return options.html.match(/>([^<]+)/)[1]
        }
        return undefined
      })
      .filter((m: any) => m !== undefined)
    const [label, hasStartOrFinish] = createClusterLabel(innerLabels, true)
    return divIcon({
      className: `custom-div-icon-${hasStartOrFinish}`,
      html: `<div class='marker-pin-${hasStartOrFinish}'>${label}</div>`,
      iconAnchor: [0, 0],
    })
  }
  const options = getChildOptions(cluster.getAllChildMarkers()[0])
  return divIcon({
    ...options,
  })
}

const POIMarker: FC = ({ children }) => (
  <MarkerClusterGroup
    maxClusterRadius="10"
    singleMarkerMode
    iconCreateFunction={createClusterCustomIcon}
  >
    {children}
  </MarkerClusterGroup>
)

export default POIMarker
