import { Action } from 'redux'
import {
  BannerActionTypes,
  BROWSE_BANNERS,
  LOAD_BANNER,
  CACHE_BANNERS,
  LOAD_RECENT_BANNERS,
  LOAD_RECENT_BANNERS_ERROR,
  RESET_BROWSED_BANNERS,
  SEARCH_BANNERS,
  RESET_SEARCH_BANNERS,
  AGENT_BANNERS,
  RESET_AGENT_BANNERS,
  CREATE_BANNER,
  REMOVE_CREATED_BANNER,
  EDIT_BANNER,
  RESET_MAP_BANNERS,
  SEARCH_MAP_BANNERS,
  CHANGE_BANNER_SETTINS,
  USER_BANNER_LIST_BANNERS,
  RESET_USER_BANNER_LIST_BANNERS,
} from './actionTypes'
import { extend, extendSorted } from './helpers'
import { Banner, BannerState } from './types'

const initialState: BannerState = {
  banners: [],
  fullBanners: [],
  recentBanners: [],
  browsedBanners: [],
  searchBanners: [],
  agentBanners: [],
  mapBanners: [],
  settingsVersions: {},
  userBannerListBanners: [],
  canBrowseMore: true,
  canSearchMore: true,
  hasMoreAgentBanners: true,
  hasMoreUserBannerListBanners: true,
  createdBanner: undefined,
}

export default (state = initialState, incomingAction: Action): BannerState => {
  // Unknown Redux actions fall through to the unchanged state.
  const action = incomingAction as BannerActionTypes
  switch (action.type) {
    case CACHE_BANNERS: {
      const cachedById = new Map(
        state.banners.map((banner) => [banner.id, banner])
      )
      return {
        ...state,
        banners: extend(
          action.payload.map((banner) => {
            const cached = cachedById.get(banner.id)
            const settingsChanged =
              (state.settingsVersions[banner.id] ?? 0) !==
              (action.settingsVersionsAtRequest[banner.id] ?? 0)
            // A summary requested before a successful save must not undo it.
            return {
              ...cached,
              ...banner,
              ...(settingsChanged && cached && { listType: cached.listType }),
            }
          }),
          state.banners
        ),
      }
    }
    case LOAD_BANNER:
      return {
        ...state,
        banners: extend([action.payload], state.banners),
        fullBanners: extend([action.payload], state.fullBanners),
      }

    case LOAD_RECENT_BANNERS:
      return {
        ...state,
        banners: extendSorted(state.banners, action.payload),
        recentBanners: action.payload,
      }
    case RESET_BROWSED_BANNERS:
      return { ...state, browsedBanners: [] }
    case BROWSE_BANNERS:
      return {
        ...state,
        banners: extendSorted(state.banners, action.payload.banners),
        browsedBanners: extend(state.browsedBanners, action.payload.banners),
        canBrowseMore: action.payload.hasMore,
      }
    case SEARCH_BANNERS:
      return {
        ...state,
        banners: extendSorted(state.banners, action.payload.banners),
        searchBanners: extend(state.searchBanners, action.payload.banners),
        canSearchMore: action.payload.hasMore,
      }
    case RESET_SEARCH_BANNERS:
      return { ...state, searchBanners: [] }
    case AGENT_BANNERS:
      return {
        ...state,
        banners: extendSorted(state.banners, action.payload.banners),
        agentBanners: extend(state.agentBanners, action.payload.banners),
        hasMoreAgentBanners: action.payload.hasMore,
      }
    case RESET_AGENT_BANNERS:
      return { ...state, agentBanners: [] }
    case USER_BANNER_LIST_BANNERS:
      return {
        ...state,
        banners: extendSorted(state.banners, action.payload.banners),
        userBannerListBanners: extend(
          state.userBannerListBanners,
          action.payload.banners
        ),
        hasMoreUserBannerListBanners: action.payload.hasMore,
      }
    case RESET_USER_BANNER_LIST_BANNERS:
      return { ...state, userBannerListBanners: [] }
    case LOAD_RECENT_BANNERS_ERROR:
      return state
    case CREATE_BANNER:
      return { ...state, createdBanner: action.payload }
    case REMOVE_CREATED_BANNER:
      return { ...state, createdBanner: undefined }
    case EDIT_BANNER:
      return { ...state, createdBanner: action.payload }
    case RESET_MAP_BANNERS:
      return {
        ...state,
        mapBanners: [],
      }
    case SEARCH_MAP_BANNERS:
      return {
        ...state,
        mapBanners: extendSorted(state.mapBanners, action.payload),
      }
    case CHANGE_BANNER_SETTINS: {
      const { banner, bannerSettings } = action.payload
      // List cards contain summaries. Preserve cached mission details and
      // never mark a summary as a fully loaded banner.
      const update = (banners: Banner[]) =>
        banners.map((cached) =>
          cached.id === banner.id ? { ...cached, ...bannerSettings } : cached
        )
      const cachedBanner =
        state.banners.find((cached) => cached.id === banner.id) ?? banner
      return {
        ...state,
        banners: extend(
          [{ ...cachedBanner, ...bannerSettings }],
          state.banners
        ),
        fullBanners: update(state.fullBanners),
        recentBanners: update(state.recentBanners),
        browsedBanners: update(state.browsedBanners),
        searchBanners: update(state.searchBanners),
        agentBanners: update(state.agentBanners),
        mapBanners: update(state.mapBanners),
        userBannerListBanners: update(state.userBannerListBanners),
        settingsVersions: {
          ...state.settingsVersions,
          [banner.id]: (state.settingsVersions[banner.id] ?? 0) + 1,
        },
      }
    }
    default:
      return state
  }
}
