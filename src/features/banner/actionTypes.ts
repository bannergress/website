import { RehydrateAction } from '../../storeTypes'
import { Banner } from './types'

export const LOAD_BANNER = 'LOAD_BANNER'
export const LOAD_BANNER_ERROR = 'LOAD_BANNER_ERROR'
export const LOAD_RECENT_BANNERS = 'LOAD_RECENT_BANNERS'
export const LOAD_RECENT_BANNERS_ERROR = 'LOAD_RECENT_BANNERS_ERROR'
export const RESET_BROWSED_BANNERS = 'RESET_BROWSED_BANNERS'
export const BROWSE_BANNERS = 'BROWSE_BANNERS'
export const RESET_SEARCH_BANNERS = 'RESET_SEARCH_BANNERS'
export const SEARCH_BANNERS = 'SEARCH_BANNERS'
export const SEARCH_MAP_BANNERS = 'SEARCH_MAP_BANNERS'
export const CREATE_BANNER = 'CREATE_BANNER'
export const REMOVE_CREATED_BANNER = 'REMOVE_CREATED_BANNER'

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

interface BrowseBannersAction {
  type: typeof BROWSE_BANNERS
  payload: {
    banners: Array<Partial<Banner>>
    hasMore: Boolean
  }
}

interface ResetBrowsedBannersAction {
  type: typeof RESET_BROWSED_BANNERS
}

interface SearchBannersAction {
  type: typeof SEARCH_BANNERS
  payload: {
    banners: Array<Partial<Banner>>
    hasMore: Boolean
  }
}

interface ResetSearchBannersAction {
  type: typeof RESET_SEARCH_BANNERS
}

interface CreateBannerAction {
  type: typeof CREATE_BANNER
  payload: Banner
}

interface RemoveCreatedBannerAction {
  type: typeof REMOVE_CREATED_BANNER
}

interface SearchMapBannersAction {
  type: typeof SEARCH_MAP_BANNERS
  payload: Array<Partial<Banner>>
}

export type BannerActionTypes =
  | LoadBannerAction
  | LoadRecentBannersAction
  | LoadBannerErrorAction
  | LoadRecentBannersErrorAction
  | BrowseBannersAction
  | ResetBrowsedBannersAction
  | RehydrateAction
  | SearchBannersAction
  | ResetSearchBannersAction
  | CreateBannerAction
  | RemoveCreatedBannerAction
  | SearchMapBannersAction
