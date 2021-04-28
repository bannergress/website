import { REHYDRATE } from 'redux-persist/es/constants'
import _ from 'underscore'
import {
  MissionActionTypes,
  SEARCH_MISSIONS,
  RESET_SEARCH_MISSIONS,
} from './actionTypes'
import { Mission, MissionState } from './types'

const initialState: MissionState = {
  searchedMissions: [],
  canSearchMore: true,
}

const extend = (
  source: Array<Partial<Mission>>,
  target: Array<Partial<Mission>>
): Array<Partial<Mission>> => {
  return _.uniq(
    _.flatten([source, target]),
    false,
    (a: Partial<Mission>) => a.id
  )
}

export default (state = initialState, action: MissionActionTypes) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
      }
    case SEARCH_MISSIONS:
      return {
        ...state,
        searchedMissions: extend(
          state.searchedMissions,
          action.payload.missions
        ),
        canSearchMore: action.payload.hasMore,
      }
    case RESET_SEARCH_MISSIONS:
      return { ...state, searchedMissions: [], canSearchMore: true }
    default:
      return state
  }
}
