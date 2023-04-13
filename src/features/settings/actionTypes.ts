import { SettingsState } from './types'

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'

interface UpdateSettingsAction {
  type: typeof UPDATE_SETTINGS
  payload: Partial<SettingsState>
}

export type SettingsActionTypes = UpdateSettingsAction
