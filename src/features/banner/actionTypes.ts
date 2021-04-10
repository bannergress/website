import { RehydrateAction } from '../../storeTypes'
import { Banner } from './types'

export const LOAD_BANNER = 'LOAD_BANNER'
export const LOAD_BANNER_ERROR = 'LOAD_BANNER_ERROR'
export const LOAD_RECENT_BANNERS = 'LOAD_RECENT_BANNERS'
export const LOAD_RECENT_BANNERS_ERROR = 'LOAD_RECENT_BANNERS_ERROR'

interface LoadBannerAction {
  type: typeof LOAD_BANNER
  payload: Partial<Banner>
}

interface LoadBannerErrorAction {
  type: typeof LOAD_BANNER_ERROR
}

interface LoadRecentBannersAction {
  type: typeof LOAD_RECENT_BANNERS
  payload: Array<Partial<Banner>>
}

interface LoadRecentBannersErrorAction {
  type: typeof LOAD_RECENT_BANNERS_ERROR
}

export type BannerActionTypes =
  | LoadBannerAction
  | LoadRecentBannersAction
  | LoadBannerErrorAction
  | LoadRecentBannersErrorAction
  | RehydrateAction
