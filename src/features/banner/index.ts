import * as actionTypes from './actionTypes'
import {
  getBanner,
  getRecentBanners,
  getBrowsedBanners,
  getHasMoreBrowsedBanners,
  getSearchBanners,
  getHasMoreSearchBanners,
} from './selectors'
import {
  loadBannerAction,
  loadRecentBannersAction,
  loadBrowsedBannersAction,
  loadSearchBannersAction,
} from './actions'
import {
  Banner,
  BannerState,
  NumDictionary,
  BannerOrder,
  BannerOrderDirection,
} from './types'

export { default as BannerReducer } from './reducer'
export { actionTypes }
export {
  getBanner,
  getRecentBanners,
  getBrowsedBanners,
  getHasMoreBrowsedBanners,
  getSearchBanners,
  getHasMoreSearchBanners,
}
export {
  loadBannerAction as loadBanner,
  loadRecentBannersAction as loadRecentBanners,
  loadBrowsedBannersAction as loadBrowsedBanners,
  loadSearchBannersAction as loadSearchBanners,
}
export type {
  Banner,
  BannerState,
  NumDictionary,
  BannerOrder,
  BannerOrderDirection,
}
