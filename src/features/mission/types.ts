export type POI = PortalPOI | FieldTripWaypointPOI | UnavailablePOI

export interface PortalPOI {
  id: string
  title: string
  latitude: number
  longitude: number
  picture: string
  type: 'portal'
}

export interface FieldTripWaypointPOI {
  id: string
  title: string
  latitude: number
  longitude: number
  type: 'fieldTripWaypoint'
}

export interface UnavailablePOI {
  id: string
  type: 'unavailable'
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
  author?: NamedAgent
}

export interface MissionState {
  searchedMissions: Array<Mission>
  canSearchMore: Boolean
}

export interface NamedAgent {
  name: string
  faction: 'enlightened' | 'resistance'
}
