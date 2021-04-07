import { LOAD_BANNER, LOAD_RECENT_BANNERS } from './actionTypes'

interface LoadBannerAction {
  type: typeof LOAD_BANNER
  payload: Partial<Banner>
}

interface LoadRecentBannersAction {
  type: typeof LOAD_RECENT_BANNERS
  payload: Array<Partial<Banner>>
}

export type BannerActionTypes = LoadBannerAction | LoadRecentBannersAction

export interface BannerState {
  banners: Array<Banner>
  recentBanners: Array<Banner>
}

export interface Banner {
  id: number
  title: string
  numberOfMissions: number
  missions: Dictionary<Mission>
  startLatitude: number
  startLongitude: number
  lenghtMeters: number
}

export interface Mission {
  id: string
  title: string
  picture: string
  steps: Array<Step>
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

export interface POI {
  id: string
  title: string
  latitude: number
  longitude: number
  picture: string
  type: 'portal' | 'fieldTrip'
}

export interface Dictionary<T> {
  [n: number]: T
}
