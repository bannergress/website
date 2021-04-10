import {
  LOAD_BANNER,
  LOAD_BANNER_ERROR,
  LOAD_RECENT_BANNERS,
  LOAD_RECENT_BANNERS_ERROR,
} from './actionTypes'
import { BannerActionTypes } from './types'

const initialState = {
  banners: [],
  recentBanners: []
}

export default (state = initialState, action: BannerActionTypes) => {
  switch (action.type) {
    case LOAD_BANNER:
      return { ...state, banners: [...state.banners, action.payload] }
    case LOAD_RECENT_BANNERS:
      return { ...state, recentBanners: action.payload }
    case LOAD_BANNER_ERROR:
      return state
    case LOAD_RECENT_BANNERS_ERROR:
      return state
    default:
      return state
  }
}
