import { Dispatch } from 'redux'
import { Place } from '../place'
import {
  BannerActionTypes,
  LOAD_BANNER,
  LOAD_BANNER_ERROR,
  LOAD_RECENT_BANNERS,
  LOAD_RECENT_BANNERS_ERROR,
} from './actionTypes'
import * as api from './api'
import { BannerOrder, BannerOrderDirection } from './types'

export const loadBannerAction = (id: number) => async (
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
  place: Place,
  order: BannerOrder,
  orderDirection: BannerOrderDirection
) => async (dispatch: Dispatch<BannerActionTypes>) => {
  const response = await api.getBanners(place.id, order, orderDirection)
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
