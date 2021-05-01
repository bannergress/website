export interface POI {
  id: string
  title: string
  latitude: number
  longitude: number
  picture: string
  type: 'portal' | 'fieldTripWaypoint' | 'unavailable'
}

export interface Step {
  poi?: POI
  objective?: Objective
}

export type Objective =
  | 'hack'
  | 'captureOrUpgrade'
  | 'createLink'
  | 'createField'
  | 'installMod'
  | 'takePhoto'
  | 'viewWaypoint'
  | 'enterPassphrase'

export interface Mission {
  id: string
  title: string
  picture: string
  steps?: Array<Step>
  description?: string
  startLatitude?: number
  startLongitude?: number
  type?: 'hidden' | 'anyOrder' | 'sequential'
  online?: Boolean
}

export interface MissionState {
  searchedMissions: Array<Mission>
  canSearchMore: Boolean
}
