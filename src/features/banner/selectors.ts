import { RootState } from '../../storeTypes'

export const getBanner = (state: RootState, id: number) =>
  state.banner.banners.find((b) => b.id === id)

export const getRecentBanners = (state: RootState) => state.banner.recentBanners
