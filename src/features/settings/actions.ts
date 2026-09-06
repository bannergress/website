import { Dispatch } from 'redux'
import { SettingsActionTypes, UPDATE_SETTINGS } from './actionTypes'
import { SettingsState } from './types'

export const updateSettingsAction =
  (settings: Partial<SettingsState>) =>
  (dispatch: Dispatch<SettingsActionTypes>) => {
    dispatch({
      type: UPDATE_SETTINGS,
      payload: settings,
    })
  }
