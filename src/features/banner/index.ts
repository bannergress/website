import * as actionTypes from './actionTypes'
import { getBanner, getRecentBanners } from './selectors'
import { loadBannerAction, loadRecentBannersAction } from './actions'

export { default as BannerReducer } from './bannerReducer'
export { actionTypes }
export { getBanner, getRecentBanners }
export {
  loadBannerAction as loadBanner,
  loadRecentBannersAction as loadRecentBanners
}
