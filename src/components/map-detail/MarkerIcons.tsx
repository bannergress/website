import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Marker, divIcon } from 'leaflet'
import {
  MarkerData,
  MissionMarkerData,
  POIMarkerData,
  getMarkerData,
  EndMarkerData,
  isFirstMissionInSequence,
} from './MarkerData'
import { getMarkerDataLabel } from './MarkerLabels'

const getEndMarkerIcon = (
  markerData: EndMarkerData,
  additionalClassName: string
) => {
  const content = (
    <div className={`square-marker-pin ${additionalClassName}`}>
      {getMarkerDataLabel(markerData)}
    </div>
  )
  const contentAsString = renderToStaticMarkup(content)

  const icon = divIcon({
    className: 'custom-div-icon-true',
    html: contentAsString,
    iconAnchor: [0, 0],
  })

  return icon
}

function getMissionMarkerIcon(
  markerData: MissionMarkerData,
  additionalClassName: string
) {
  const firstMissionInSequence = isFirstMissionInSequence(markerData)
  const content = (
    <div
      className={`marker-pin-${firstMissionInSequence} ${additionalClassName}`}
    >
      {getMarkerDataLabel(markerData)}
    </div>
  )
  const contentAsString = renderToStaticMarkup(content)

  const icon = divIcon({
    className: `custom-div-icon-${firstMissionInSequence}`,
    html: contentAsString,
    iconAnchor: [0, 0],
  })

  return icon
}

const getPoiMarkerIcon = (
  markerData: POIMarkerData,
  additionalClassName: string
) => {
  const content = (
    <div className={`marker-poi-pin ${additionalClassName}`}>
      {getMarkerDataLabel(markerData)}
    </div>
  )
  const contentAsString = renderToStaticMarkup(content)

  const icon = divIcon({
    className: 'custom-div-poi-icon',
    html: contentAsString,
    iconAnchor: [0, 0],
  })

  return icon
}

function getEmptyIcon(additionalClassName: string) {
  const content = <div className={additionalClassName} />
  const contentAsString = renderToStaticMarkup(content)

  const icon = divIcon({
    html: contentAsString,
    iconAnchor: [0, 0],
  })

  return icon
}

export const getMarkerDataIcon = (
  markerData: MarkerData | null,
  additionalClassName: string = ''
) => {
  if (markerData) {
    switch (markerData.markerType) {
      case 'end':
        return getEndMarkerIcon(markerData, additionalClassName)
      case 'poi':
        return getPoiMarkerIcon(markerData, additionalClassName)
        break
      case 'mission':
        return getMissionMarkerIcon(markerData, additionalClassName)
        break
      default:
        break
    }
  }
  return getEmptyIcon(additionalClassName)
}

export const getMarkerIcon = (
  marker: Marker,
  additionalClassName: string = ''
) => {
  const markerData = getMarkerData(marker)
  return getMarkerDataIcon(markerData, additionalClassName)
}
