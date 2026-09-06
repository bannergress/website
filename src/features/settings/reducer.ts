import { Action } from 'redux'
import { SettingsActionTypes, UPDATE_SETTINGS } from './actionTypes'
import { SettingsState } from './types'

const initialState: SettingsState = {
  defaultOrderBy: 'created',
  defaultOrderDirection: 'DESC',
  defaultOnline: true,
  defaultProximityLatitude: undefined,
  defaultProximityLongitude: undefined,
}

export const SettingsReducer = (
  state = initialState,
  incomingAction: Action
): SettingsState => {
  // Unknown Redux actions fall through to the unchanged state.
  const action = incomingAction as SettingsActionTypes
  switch (action.type) {
    case UPDATE_SETTINGS:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}
