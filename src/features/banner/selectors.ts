import { BannerState } from './types'

export const getBanner = (state: BannerState, id: string) =>
  state.banners.find((b) => b.id === id)

export const getRecentBanners = (state: BannerState) => state.recentBanners
