import { RehydrateAction } from '../../storeTypes'
import { Mission } from './types'

export const SEARCH_MISSIONS = 'SEARCH_MISSIONS'
export const RESET_SEARCH_MISSIONS = 'RESET_SEARCH_MISSIONS'

interface SearchMissionsAction {
  type: typeof SEARCH_MISSIONS
  payload: {
    missions: Array<Partial<Mission>>
    hasMore: Boolean
  }
}

interface ResetSearchMissionsAction {
  type: typeof RESET_SEARCH_MISSIONS
}

export type MissionActionTypes =
  | SearchMissionsAction
  | ResetSearchMissionsAction
  | RehydrateAction
