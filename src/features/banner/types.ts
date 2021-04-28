import { Mission } from '../mission/types'

export interface NumDictionary<T> {
  [n: number]: T
}

export interface Banner {
  uuid: string
  title: string
  description?: string
  numberOfMissions: number
  startLatitude: number
  startLongitude: number
  lengthMeters?: number
  formattedAddress?: string
  picture?: string
  missions?: NumDictionary<Mission>
}

export interface BannerState {
  banners: Array<Banner>
  recentBanners: Array<Banner>
  browsedBanners: Array<Banner>
  searchBanners: Array<Banner>
  canBrowseMore: Boolean
  canSearchMore: Boolean
  createdBanner: Banner | undefined
}

export type BannerOrder =
  | 'created'
  | 'lengthMeters'
  | 'title'
  | 'numberOfMissions'
export type BannerOrderDirection = 'ASC' | 'DESC'
