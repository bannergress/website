import _ from 'underscore'
import { RootState } from '../../storeTypes'
import { containsBanner } from './helpers'

export const getBanner = (state: RootState, id: string) =>
  state.banner.banners.find((b) => b.id === id)

export const getRecentBanners = (state: RootState) => state.banner.recentBanners

export const getBrowsedBanners = (state: RootState) =>
  state.banner.browsedBanners

export const getHasMoreBrowsedBanners = (state: RootState) =>
  state.banner.canBrowseMore

export const getSearchBanners = (state: RootState) => state.banner.searchBanners

export const getHasMoreSearchBanners = (state: RootState) =>
  state.banner.canSearchMore

export const getCreatedBanner = (state: RootState) => state.banner.createdBanner

export const getMapBanners = (
  state: RootState,
  topRightLat: number,
  topRightLng: number,
  bottomLeftLat: number,
  bottomLeftLng: number
) =>
  _(state.banner.banners)
    .chain()
    .filter((b) =>
      containsBanner(b, topRightLat, topRightLng, bottomLeftLat, bottomLeftLng)
    )
    .take(500)
    .value()
