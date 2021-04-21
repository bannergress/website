import * as actionTypes from './actionTypes'
import {
  getBanner,
  getRecentBanners,
  getBrowsedBanners,
  getHasMoreBrowsedBanners,
} from './selectors'
import {
  loadBannerAction,
  loadRecentBannersAction,
  loadBrowsedBannersAction,
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
}
export {
  loadBannerAction as loadBanner,
  loadRecentBannersAction as loadRecentBanners,
  loadBrowsedBannersAction as loadBrowsedBanners,
}
export type {
  Banner,
  BannerState,
  NumDictionary,
  BannerOrder,
  BannerOrderDirection,
}
