import { REHYDRATE } from 'redux-persist/es/constants'
import _ from 'underscore'
import {
  BannerActionTypes,
  BROWSE_BANNERS,
  LOAD_BANNER,
  LOAD_BANNER_ERROR,
  LOAD_RECENT_BANNERS,
  LOAD_RECENT_BANNERS_ERROR,
  RESET_BROWSED_BANNERS,
} from './actionTypes'
import { Banner, BannerState } from './types'

const initialState: BannerState = {
  banners: [],
  recentBanners: [],
  browsedBanners: [],
  canBrowseMore: true,
}

const extend = (
  source: Array<Partial<Banner>>,
  target: Array<Partial<Banner>>
): Array<Partial<Banner>> => {
  return _.uniq(
    _.flatten([source, target]),
    false,
    (a: Partial<Banner>) => a.uuid
  )
}

export default (state = initialState, action: BannerActionTypes) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        banners: action.payload?.banner.banners || state.banners,
      }
    case LOAD_BANNER:
      return { ...state, banners: extend([action.payload], state.banners) }
    case LOAD_RECENT_BANNERS:
      return {
        ...state,
        banners: extend(state.banners, action.payload),
        recentBanners: action.payload,
      }
    case RESET_BROWSED_BANNERS:
      return { ...state, browsedBanners: [] }
    case BROWSE_BANNERS:
      return {
        ...state,
        banners: extend(state.banners, action.payload.banners),
        browsedBanners: extend(state.browsedBanners, action.payload.banners),
        canBrowseMore: action.payload.hasMore,
      }
    case LOAD_BANNER_ERROR:
      return state
    case LOAD_RECENT_BANNERS_ERROR:
      return state
    default:
      return state
  }
}
