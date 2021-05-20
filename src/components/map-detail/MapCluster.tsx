import React, { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon, LeafletMouseEvent, MarkerCluster } from 'leaflet'
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

  let otherLabels: Array<JSX.Element | undefined> = []
  if (markerData.length > 2) {
    otherLabels = [
      <div
        key="generic-label"
        className="marker-pin-row"
      >{`×${otherMarkers.length}`}</div>,
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
    labels: resultingLabels.filter((l) => !!l),
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
      .filter((m) => !!m) as MarkerData[]

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

const createClusterTooltip = (cluster: MarkerCluster) => {
  let tooltip
  const numberMarkers = cluster.getChildCount()
  if (numberMarkers > 1) {
    const markerData = cluster
      .getAllChildMarkers()
      .map((marker) => getMarkerData(marker))
      .filter((m) => !!m) as MarkerData[]

    const ordered =
      markerData.find((m) => m.markerType === 'mission' && m.isSequential) !==
      undefined
    let numMissions = 0
    let hasStart = false
    let hasFinish = false
    markerData.reverse().forEach((marker) => {
      if (marker.markerType === 'end') {
        hasFinish = true
      } else if (isFirstMissionInSequence(marker)) {
        hasStart = true
      } else if (marker.markerType === 'mission') {
        numMissions += 1
      }
    })
    if (hasFinish && ordered) {
      tooltip = `Banner ends here`
    }
    if (numMissions) {
      tooltip = `${numMissions} mission${
        numMissions > 1 ? 's' : ''
      } starting here${tooltip ? `<br />${tooltip}` : ''}`
    }
    if (hasStart && ordered) {
      tooltip = `Banner starts here${tooltip ? `<br />${tooltip}` : ''}`
    }
  }
  return tooltip
}

const MapCluster: FC<MapClusterProps> = ({ pane, children }) => {
  const handleOnMouseOver = (c: LeafletMouseEvent) => {
    c.propagatedFrom
      .bindTooltip(createClusterTooltip(c.propagatedFrom), {
        sticky: false,
        direction: 'right',
      })
      .openTooltip()
  }
  const handleOnMouseOut = (c: LeafletMouseEvent) => {
    c.propagatedFrom.unbindTooltip()
  }

  const options: any = {
    maxClusterRadius: 25,
    singleMarkerMode: true,
    iconCreateFunction: createClusterCustomIcon,
    onMouseOver: handleOnMouseOver,
    onMouseOut: handleOnMouseOut,
    onMouseClick: handleOnMouseOut,
  }
  if (pane) {
    options.clusterPane = pane
    options.pane = pane
  }
  return <MarkerClusterGroup {...options}>{children}</MarkerClusterGroup>
}

export interface MapClusterProps {
  pane?: string
}

export default MapCluster
