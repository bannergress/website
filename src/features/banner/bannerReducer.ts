import { LOAD_BANNER } from './actionTypes'
import { BannerActionTypes } from './types'

const initialState = {
  banners: [],
}

export default (state = initialState, action: BannerActionTypes) => {
  switch (action.type) {
    case LOAD_BANNER:
      return { ...state, banners: [...state.banners, action.payload] }
    default:
      return state
  }
}
