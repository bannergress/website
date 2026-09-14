import { BannerState } from './features/banner'
import { PlaceState } from './features/place'
import { MissionState } from './features/mission'
import { SettingsState } from './features/settings/types'

export interface RootState {
  banner: BannerState
  place: PlaceState
  mission: MissionState
  settings: SettingsState
}

export interface RehydrateAction {
  type: 'persist/REHYDRATE'
  key: string
  payload?: RootState | null
  err?: unknown
}
