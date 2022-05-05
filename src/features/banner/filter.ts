export type BannerOrder =
  | 'relevance'
  | 'listAdded'
  | 'created'
  | 'lengthMeters'
  | 'title'
  | 'numberOfMissions'

export type BannerOrderDirection = 'ASC' | 'DESC'

export type BannerFilter = {
  orderBy: BannerOrder
  orderDirection: BannerOrderDirection
  online: boolean | undefined
  onlyOfficialMissions?: boolean
}
