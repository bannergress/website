import { BannerState } from './types'

export const getBanner = (state: BannerState, id: number) =>
  state.banners.find((b) => b.id === id)

export const getRecentBanners = (state: BannerState) => state.recentBanners
