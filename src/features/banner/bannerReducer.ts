import { REHYDRATE } from 'redux-persist/es/constants'
import _ from 'underscore'
import {
  BannerActionTypes,
  LOAD_BANNER,
  LOAD_BANNER_ERROR,
  LOAD_RECENT_BANNERS,
  LOAD_RECENT_BANNERS_ERROR,
} from './actionTypes'
import { Banner } from './types'

const initialState = {
  banners: [],
  recentBanners: [],
}

const extend = (
  source: Array<Partial<Banner>>,
  target: Array<Partial<Banner>>
): Array<Partial<Banner>> => {
  return _.uniq(
    _.flatten([source, target]),
    false,
    (a: Partial<Banner>) => a.id
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
    case LOAD_BANNER_ERROR:
      return state
    case LOAD_RECENT_BANNERS_ERROR:
      return state
    default:
      return state
  }
}
