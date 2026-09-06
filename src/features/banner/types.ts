import { Mission } from '../mission'

export interface NumDictionary<T> {
  [n: number]: T
}

export interface Banner {
  id: string
  requestedId?: string
  title: string
  description?: string
  numberOfMissions: number
  numberOfSubmittedMissions: number
  numberOfDisabledMissions: number
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
  owner?: boolean
  warning?: string
  plannedOfflineDate?: string
  eventStartDate?: string
  eventEndDate?: string
}

export interface BannerState {
  banners: Array<Banner>
  fullBanners: Array<Banner>
  recentBanners: Array<Banner>
  browsedBanners: Array<Banner>
  searchBanners: Array<Banner>
  agentBanners: Array<Banner>
  userBannerListBanners: Array<Banner>
  mapBanners: Array<Banner>
  canBrowseMore: boolean
  canSearchMore: boolean
  hasMoreAgentBanners: boolean
  hasMoreUserBannerListBanners: boolean
  createdBanner: Banner | undefined
}

export interface BannerSettings {
  listType?: BannerListType
}

export type BannerType = 'sequential' | 'anyOrder'
export type BannerListType = 'todo' | 'done' | 'blacklist' | 'none'
