import { RehydrateErrorType } from 'redux-persist'

import { BannerState } from './features/banner/types'
import { MissionState } from './features/mission/types'
import { PlaceState } from './features/place/types'

export interface RootState {
  banner: BannerState
  place: PlaceState
  mission: MissionState
}

export interface RehydrateAction {
  type: 'persist/REHYDRATE'
  key: string
  payload?: RootState | null
  err?: RehydrateErrorType | null
}
