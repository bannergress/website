import { SettingsActionTypes, UPDATE_SETTINGS } from './actionTypes'
import { SettingsState } from './types'

const initialState: SettingsState = {
  defaultOrderBy: 'created',
  defaultOrderDirection: 'DESC',
  defaultOnline: true,
}

export const SettingsReducer = (
  state = initialState,
  action: SettingsActionTypes
) => {
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
