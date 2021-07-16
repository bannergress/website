import { Mission } from '../mission/types'

export interface NumDictionary<T> {
  [n: number]: T
}

export interface Banner {
  id: string
  title: string
  description?: string
  numberOfMissions: number
  startLatitude: number
  startLongitude: number
  lengthMeters?: number
  formattedAddress?: string
  picture?: string
  missions?: NumDictionary<Mission>
  type?: BannerType
  listType?: BannerListType
  width?: number
  averageDurationMilliseconds?: number
  startPlaceId?: string
}

export interface BannerState {
  banners: Array<Banner>
  recentBanners: Array<Banner>
  browsedBanners: Array<Banner>
  searchBanners: Array<Banner>
  agentBanners: Array<Banner>
  officialBanners: Array<Banner>
  canBrowseMore: Boolean
  canSearchMore: Boolean
  hasMoreAgentBanners: Boolean
  createdBanner: Banner | undefined
}

export interface BannerSettings {
  listType?: BannerListType
}

export type BannerType = 'sequential' | 'anyOrder'
export type BannerListType = 'todo' | 'done' | 'blacklist' | 'none'

export type ApiOrder = 'created' | 'lengthMeters' | 'title' | 'numberOfMissions'
export type ApiOrderDirection = 'ASC' | 'DESC'
