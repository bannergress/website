import { Mission } from '../mission/types'

export interface NumDictionary<T> {
  [n: number]: T
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
