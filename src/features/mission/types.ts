export interface POI {
  id: string
  title: string
  latitude: number
  longitude: number
  picture: string
  type: 'portal' | 'fieldTrip'
}

export interface Step {
  poi: POI
  objective:
    | 'hack'
    | 'install a mod'
    | 'capture or upgrade'
    | 'create link'
    | 'create field'
    | 'passphrase'
    | 'fieldTrip'
}

export interface Mission {
  id: string
  title: string
  picture: string
  steps?: Array<Step>
  description: string
  type?: 'hidden' | 'anyOrder' | 'sequential'
  online: Boolean
}

export interface MissionState {
  searchedMissions: Array<Mission>
  canSearchMore: Boolean
}
