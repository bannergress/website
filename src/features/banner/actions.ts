import { Dispatch } from 'redux'
import { RootState } from '../../storeTypes'
import {
  BannerActionTypes,
  BROWSE_BANNERS,
  LOAD_BANNER,
  LOAD_RECENT_BANNERS,
  RESET_BROWSED_BANNERS,
  SEARCH_BANNERS,
  RESET_SEARCH_BANNERS,
  AGENT_BANNERS,
  RESET_AGENT_BANNERS,
  USER_BANNER_LIST_BANNERS,
  RESET_USER_BANNER_LIST_BANNERS,
  CREATE_BANNER,
  REMOVE_CREATED_BANNER,
  SEARCH_MAP_BANNERS,
  SEARCH_MAP_OFFICIAL_BANNERS,
  CHANGE_BANNER_SETTINS,
  EDIT_BANNER,
  DELETE_BANNER,
} from './actionTypes'
import * as api from './api'
import { getCreatedBanner } from './selectors'
import {
  Banner,
  ApiOrder,
  ApiOrderDirection,
  BannerSettings,
  BannerListType,
} from './types'

export const loadBannerAction = (id: string) => async (
  dispatch: Dispatch<BannerActionTypes>
) => {
  const response = await api.getBanner(id)
  if (response.ok && response.data !== undefined) {
    const banner = { ...response.data, requestedId: id }
    dispatch({
      type: LOAD_BANNER,
      payload: banner,
    })
  } else if (response.status === 404) {
    throw new Error('Banner not found')
  }
}

export const loadRecentBannersAction = () => async (
  dispatch: Dispatch<BannerActionTypes>
) => {
  const response = await api.getRecentBanners(12)
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: LOAD_RECENT_BANNERS,
      payload: response.data,
    })
  } else {
    throw new Error('Error loading banners')
  }
}

export const loadBrowsedBannersAction = (
  placeId: string | null,
  order: ApiOrder,
  orderDirection: ApiOrderDirection,
  page: number
) => async (dispatch: Dispatch<BannerActionTypes>) => {
  if (page === 0) {
    dispatch({
      type: RESET_BROWSED_BANNERS,
    })
  }
  const response = await api.getBanners(
    placeId ?? undefined,
    order,
    orderDirection,
    page
  )
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

export const loadSearchBannersAction = (
  searchTerm: string,
  order: ApiOrder,
  orderDirection: ApiOrderDirection,
  page: number
) => async (dispatch: Dispatch<BannerActionTypes>) => {
  if (page === 0) {
    dispatch({
      type: RESET_SEARCH_BANNERS,
    })
  }
  const response = await api.searchBanners(
    searchTerm,
    order,
    orderDirection,
    page
  )
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: SEARCH_BANNERS,
      payload: {
        banners: response.data,
        hasMore: response.data && response.data.length === api.PAGE_SIZE,
      },
    })
  } else {
    // dispatch({
    //   type: BROWSE_SEARCH_ERROR,
    // })
  }
}

export const loadAgentBannersAction = (
  agentName: string,
  order: ApiOrder,
  orderDirection: ApiOrderDirection,
  page: number
) => async (dispatch: Dispatch<BannerActionTypes>) => {
  if (page === 0) {
    dispatch({
      type: RESET_AGENT_BANNERS,
    })
  }
  const response = await api.listAgentBanners(
    agentName,
    order,
    orderDirection,
    page
  )
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: AGENT_BANNERS,
      payload: {
        banners: response.data,
        hasMore: response.data && response.data.length === api.PAGE_SIZE,
      },
    })
  } else {
    // dispatch({
    //   type: BROWSE_SEARCH_ERROR,
    // })
  }
}

export const loadUserBannerListBannersAction = (
  listType: BannerListType,
  order: ApiOrder,
  orderDirection: ApiOrderDirection,
  page: number
) => async (dispatch: Dispatch<BannerActionTypes>) => {
  if (page === 0) {
    dispatch({
      type: RESET_USER_BANNER_LIST_BANNERS,
    })
  }
  const response = await api.listUserBannerListBanners(
    listType,
    order,
    orderDirection,
    page
  )
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: USER_BANNER_LIST_BANNERS,
      payload: {
        banners: response.data,
        hasMore: response.data && response.data.length === api.PAGE_SIZE,
      },
    })
  } else {
    // dispatch({
    //   type: BROWSE_SEARCH_ERROR,
    // })
  }
}

export const createBannerAction = (banner: Partial<Banner>) => async (
  dispatch: Dispatch<BannerActionTypes>
) => {
  const response = await api.postBannerPreview(banner)
  if (response.ok && response.data) {
    dispatch({
      type: CREATE_BANNER,
      payload: {
        ...banner,
        ...response.data,
      },
    })
  } else {
    throw Error('Error while loading preview')
  }
}

export const submitBannerAction = () => async (
  dispatch: Dispatch<BannerActionTypes>,
  getState: () => RootState
) => {
  const banner: Partial<Banner> = getCreatedBanner(getState())!
  const response = await (banner.id
    ? api.updateBanner(banner)
    : api.postBanner(banner!))
  if (response.ok) {
    dispatch({
      type: REMOVE_CREATED_BANNER,
    })
    dispatch({
      type: LOAD_BANNER,
      payload: { ...banner, ...response.data },
    })
    return response.data!.id
  }
  throw Error('Error while creating banner')
}

export const loadMapBannersAction = (
  topRightLat: number,
  topRightLng: number,
  bottomLeftLat: number,
  bottomLeftLng: number
) => async (dispatch: Dispatch<BannerActionTypes>) => {
  const response = await api.searchMapBanners(
    topRightLat,
    topRightLng,
    bottomLeftLat,
    bottomLeftLng,
    false
  )
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: SEARCH_MAP_BANNERS,
      payload: response.data,
    })
  } else {
    // dispatch({
    //   type: BROWSE_SEARCH_ERROR,
    // })
  }
}

export const loadMapOfficialBannersAction = (
  topRightLat: number,
  topRightLng: number,
  bottomLeftLat: number,
  bottomLeftLng: number
) => async (dispatch: Dispatch<BannerActionTypes>) => {
  const response = await api.searchMapBanners(
    topRightLat,
    topRightLng,
    bottomLeftLat,
    bottomLeftLng,
    true
  )
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: SEARCH_MAP_OFFICIAL_BANNERS,
      payload: response.data,
    })
  } else {
    // dispatch({
    //   type: BROWSE_SEARCH_ERROR,
    // })
  }
}

export const removePendingBannerAction = () => (
  dispatch: Dispatch<BannerActionTypes>
) => {
  dispatch({
    type: REMOVE_CREATED_BANNER,
  })
}

export const editBannerAction = (banner: Banner) => (
  dispatch: Dispatch<BannerActionTypes>
) => {
  dispatch({
    type: EDIT_BANNER,
    payload: banner,
  })
}

export const deleteBannerAction = (banner: Banner) => async (
  dispatch: Dispatch<BannerActionTypes>
) => {
  const response = await api.deleteBanner(banner)
  if (response.ok) {
    dispatch({
      type: DELETE_BANNER,
      payload: banner,
    })
  }
}

export const changeBannerSettingsAction = (
  banner: Banner,
  bannerSettings: BannerSettings
) => async (dispatch: Dispatch<BannerActionTypes>) => {
  const response = await api.changeBannerSettings(banner, bannerSettings)
  if (response.ok) {
    dispatch({
      type: CHANGE_BANNER_SETTINS,
      payload: {
        banner,
        bannerSettings,
      },
    })
  } else {
    throw Error('Error while changing banner settings')
  }
}
