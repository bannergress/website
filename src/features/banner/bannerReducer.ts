import { LOAD_BANNER, LOAD_RECENT_BANNERS } from './actionTypes'
import { BannerActionTypes } from './types'

const initialState = {
  banners: [],
  recentBanners: [],
}

export default (state = initialState, action: BannerActionTypes) => {
  switch (action.type) {
    case LOAD_BANNER:
      return { ...state, banners: [...state.banners, action.payload] }
    case LOAD_RECENT_BANNERS:
      return { ...state, recentBanners: action.payload }
    default:
      return state
  }
}
