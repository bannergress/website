import React, { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon, MarkerCluster } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import {
  MarkerData,
  getMarkerData,
  isFirstMissionInSequence,
} from './MarkerData'
import { getMarkerDataLabel } from './MarkerLabels'

const createClusterLabel = (markerData: MarkerData[]) => {
  let firstSequentialMissionMarker: MarkerData | null = null
  let endMarker: MarkerData | null = null
  let otherMarkers: MarkerData[] = []

  const ordered =
    markerData.find((m) => m.markerType === 'mission' && m.isSequential) !==
    undefined

  if (ordered) {
    markerData.reverse().forEach((marker) => {
      if (marker.markerType === 'end') {
        endMarker = marker
      } else if (isFirstMissionInSequence(marker)) {
        firstSequentialMissionMarker = marker
      } else {
        otherMarkers.push(marker)
      }
    })
  } else {
    otherMarkers = markerData
  }

  const firstSequentialMissionLabel = firstSequentialMissionMarker
    ? [getMarkerDataLabel(firstSequentialMissionMarker)]
    : []
  const endLabel = endMarker ? [getMarkerDataLabel(endMarker)] : []

  let otherLabels: JSX.Element[] = []
  if (markerData.length > 2) {
    otherLabels = [
      <div className="marker-pin-row">{`×${otherMarkers.length}`}</div>,
    ]
  } else {
    otherLabels = otherMarkers.map((m) => getMarkerDataLabel(m))
  }

  const resultingLabels = [
    ...firstSequentialMissionLabel,
    ...otherLabels,
    ...endLabel,
  ]
  return {
    labels: resultingLabels,
    hasStartOrFinish:
      firstSequentialMissionMarker !== null || endMarker !== null,
  }
}
const createClusterCustomIcon = (cluster: MarkerCluster) => {
  const numberMarkers = cluster.getChildCount()
  if (numberMarkers > 1) {
    const markerData = cluster
      .getAllChildMarkers()
      .map((marker) => getMarkerData(marker))
      .filter((m) => m !== undefined && m !== null) as MarkerData[]

    const { labels, hasStartOrFinish } = createClusterLabel(markerData)

    const content = (
      <div className={`marker-pin-${hasStartOrFinish}`}>{labels}</div>
    )
    const contentAsString = renderToStaticMarkup(content)

    return divIcon({
      className: `custom-div-icon-${hasStartOrFinish}`,
      html: contentAsString,
      iconAnchor: [0, 0],
    })
  }

  const singularMarker = cluster.getAllChildMarkers()[0]
  return singularMarker.getIcon()
}

const MapCluster: FC = ({ children }) => (
  <MarkerClusterGroup
    maxClusterRadius={10}
    singleMarkerMode
    iconCreateFunction={createClusterCustomIcon}
  >
    {children}
  </MarkerClusterGroup>
)

export default MapCluster
