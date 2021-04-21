import { Dispatch } from 'redux'
import { Place } from '../place'
import {
  BannerActionTypes,
  BROWSE_BANNERS,
  LOAD_BANNER,
  LOAD_BANNER_ERROR,
  LOAD_RECENT_BANNERS,
  LOAD_RECENT_BANNERS_ERROR,
  RESET_BROWSED_BANNERS,
} from './actionTypes'
import * as api from './api'
import { BannerOrder, BannerOrderDirection } from './types'

export const loadBannerAction = (id: string) => async (
  dispatch: Dispatch<BannerActionTypes>
) => {
  const response = await api.getBanner(id)
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: LOAD_BANNER,
      payload: response.data,
    })
  } else {
    dispatch({
      type: LOAD_BANNER_ERROR,
    })
  }
}

export const loadRecentBannersAction = () => async (
  dispatch: Dispatch<BannerActionTypes>
) => {
  const response = await api.getRecentBanners(10)
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: LOAD_RECENT_BANNERS,
      payload: response.data,
    })
  } else {
    dispatch({
      type: LOAD_RECENT_BANNERS_ERROR,
    })
  }
}

export const loadBrowsedBannersAction = (
  place: Partial<Place> | null,
  order: BannerOrder,
  orderDirection: BannerOrderDirection,
  page: number
) => async (dispatch: Dispatch<BannerActionTypes>) => {
  if (page === 0) {
    dispatch({
      type: RESET_BROWSED_BANNERS,
    })
  }
  const response = await api.getBanners(place?.id, order, orderDirection, page)
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: BROWSE_BANNERS,
      payload: {
        banners: response.data,
        hasMore: response.data && response.data.length === api.PAGE_SIZE,
      },
    })
  } else {
    // dispatch({
    //   type: BROWSE_BANNERS_ERROR,
    // })
  }
}
