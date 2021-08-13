import { Marker } from 'leaflet'
import { Mission, POI } from '../../features/mission'

export interface MissionMarkerData {
  markerType: 'mission'
  mission: Mission
  /**
   * The 0 based index according to the position in the
   * banner image. Holes in the banner increase the index
   */
  index: number
  /**
   * The 1 based index according list of missions. Holes in the banner
   * have no sequence number
   */
  sequence?: number
  isSequential: boolean
}
export interface EndMarkerData {
  markerType: 'end'
}

export interface POIMarkerData {
  markerType: 'poi'
  poi: POI
}

export type MarkerData = MissionMarkerData | EndMarkerData | POIMarkerData

export const isFirstMission = (data: MissionMarkerData) => {
  return data.index === 0
}

export const isFirstMissionInSequence = (data: MarkerData) => {
  return data.markerType === 'mission' && data.isSequential && data.index === 0
}

export const isHiddenMission = (data: MissionMarkerData) => {
  return data.mission.type === 'hidden'
}

export const getMarkerData: (
  marker: Marker & { markerData?: MarkerData }
) => MarkerData | undefined = (marker) => {
  return marker?.markerData
}

export const setMarkerData = (
  marker: (Marker & { markerData?: MarkerData }) | null,
  data: MarkerData | null
) => {
  // Because of the way Marker is implemented in react-leaflet, I haven't found
  // a way to extend it to be able to assign the data the usual declarative react way.
  // So, we have to use explicit setting of parameter value

  if (marker && data) {
    // eslint-disable-next-line no-param-reassign
    marker.markerData = data
  }
}
