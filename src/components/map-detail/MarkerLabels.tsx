import React from 'react'
import { Marker } from 'leaflet'

import {
  MarkerData,
  MissionMarkerData,
  getMarkerData,
  isHiddenMission,
} from './MarkerData'
import { ReactComponent as CheckeredFlagSVG } from '../../img/icons/checkered-flag.svg'
import { ReactComponent as EyeOffSVG } from '../../img/icons/eye-off-outline.svg'

const getEndMarkerLabel = () => {
  return (
    <div key="end-marker" className="marker-pin-row">
      <CheckeredFlagSVG />
    </div>
  )
}

function getMissionMarkerLabel(markerData: MissionMarkerData) {
  return (
    <div key={markerData.mission.id} className="marker-pin-row">
      {markerData.sequence ?? ''}
      {isHiddenMission(markerData) && <EyeOffSVG />}
    </div>
  )
}

export const getMarkerDataLabel = (markerData: MarkerData | undefined) => {
  if (markerData) {
    switch (markerData.markerType) {
      case 'end':
        return getEndMarkerLabel()
      case 'poi':
        break
      case 'mission':
        return getMissionMarkerLabel(markerData)
      default:
        break
    }
  }
  return undefined
}

export const getMarkerLabel = (marker: Marker) => {
  const markerData = getMarkerData(marker)
  return getMarkerDataLabel(markerData)
}
