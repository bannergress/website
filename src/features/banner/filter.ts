import { BannerListType } from './types'

export type BannerOrder =
  | 'relevance'
  | 'listAdded'
  | 'created'
  | 'lengthMeters'
  | 'title'
  | 'numberOfMissions'
  | 'proximityStartPoint'

export type BannerOrderDirection = 'ASC' | 'DESC'

export type BannerFilter = {
  orderBy: BannerOrder
  orderDirection: BannerOrderDirection
  online: boolean | undefined
  onlyOfficialMissions?: boolean
  minEventTimestamp?: string
  maxEventTimestamp?: string
  proximityLatitude?: number
  proximityLongitude?: number
  author?: string
  listTypes?: BannerListType | BannerListType[]
}
