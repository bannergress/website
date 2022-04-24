import _ from 'underscore'
import { RootState } from '../../storeTypes'
import { containsBanner } from './helpers'

export const getBanner = (state: RootState, id: string) =>
  state.banner.banners.find((b) => b.id === id) ||
  state.banner.banners.find((b) => b.requestedId === id)

export const getFullBanner = (state: RootState, id: string) =>
  state.banner.fullBanners.find((b) => b.id === id)

export const getRecentBanners = (state: RootState) => state.banner.recentBanners

export const getBrowsedBanners = (state: RootState) =>
  state.banner.browsedBanners

export const getHasMoreBrowsedBanners = (state: RootState) =>
  state.banner.canBrowseMore

export const getSearchBanners = (state: RootState) => state.banner.searchBanners

export const getHasMoreSearchBanners = (state: RootState) =>
  state.banner.canSearchMore

export const getAgentBanners = (state: RootState) => state.banner.agentBanners

export const getHasMoreAgentBanners = (state: RootState) =>
  state.banner.hasMoreAgentBanners

export const getUserBannerListBanners = (state: RootState) =>
  state.banner.userBannerListBanners

export const getHasMoreUserBannerListBanners = (state: RootState) =>
  state.banner.hasMoreUserBannerListBanners

export const getCreatedBanner = (state: RootState) => state.banner.createdBanner

export const getMapBanners = (
  state: RootState,
  topRightLat: number,
  topRightLng: number,
  bottomLeftLat: number,
  bottomLeftLng: number
) => {
  const banners = state.banner.mapBanners

  return _(banners)
    .chain()
    .filter((b) =>
      containsBanner(b, topRightLat, topRightLng, bottomLeftLat, bottomLeftLng)
    )
    .take(500)
    .value()
}
