export interface NumDictionary<T> {
  [n: number]: T
}

export interface POI {
  id: string
  title: string
  latitude: number
  longitude: number
  picture: string
  type: 'portal' | 'fieldTripWaypoint' | 'unavailable'
}

export interface Step {
  poi: POI
  objective:
    | 'hack'
    | 'captureOrUpgrade'
    | 'createLink'
    | 'createField'
    | 'installMod'
    | 'takePhoto'
    | 'viewWaypoint'
    | 'enterPassphrase'
}

export interface Mission {
  id: string
  title: string
  picture: string
  steps: Array<Step>
  description: string
  type: 'hidden' | 'anyOrder' | 'sequential'
  online: Boolean
}

export interface Banner {
  uuid: string
  title: string
  numberOfMissions: number
  startLatitude: number
  startLongitude: number
  lengthMeters: number
  formattedAddress: string
  picture: string
  missions?: NumDictionary<Mission>
}

export interface BannerState {
  banners: Array<Banner>
  recentBanners: Array<Banner>
  browsedBanners: Array<Banner>
  canBrowseMore: Boolean
}

export type BannerOrder = 'created' | 'lengthMeters' | 'title' | 'numberOfMissions'
export type BannerOrderDirection = 'ASC' | 'DESC'
