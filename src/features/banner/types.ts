export interface NumDictionary<T> {
  [n: number]: T
}

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

export type BannerOrder = 'created' | 'distance' | 'name' | 'totalmissions'
export type BannerOrderDirection = 'ASC' | 'DESC'
