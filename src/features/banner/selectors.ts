import { RootState } from '../../storeTypes'

export const getBanner = (state: RootState, id: string) =>
  state.banner.banners.find((b) => b.uuid === id)

export const getRecentBanners = (state: RootState) => state.banner.recentBanners

export const getBrowsedBanners = (state: RootState) =>
  state.banner.browsedBanners

export const getHasMoreBrowsedBanners = (state: RootState) =>
  state.banner.canBrowseMore
