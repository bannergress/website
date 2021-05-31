export type POI = PortalPOI | FieldTripWaypointPOI | UnavailablePOI
export type AvailablePOI = PortalPOI | FieldTripWaypointPOI

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

export interface AvailableStep {
  poi: AvailablePOI
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
  | 'hidden'

export type MissionType = 'hidden' | 'anyOrder' | 'sequential'

export interface Mission {
  id: string
  title: string
  picture: string
  steps?: Array<Step>
  description?: string
  startLatitude?: number
  startLongitude?: number
  type?: MissionType
  online?: Boolean
  author?: NamedAgent
  averageDurationMilliseconds?: number
  lengthMeters?: number
}

export interface MissionState {
  searchedMissions: Array<Mission>
  canSearchMore: Boolean
}

export interface NamedAgent {
  name: string
  faction: 'enlightened' | 'resistance'
}
