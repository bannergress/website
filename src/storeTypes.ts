import { RehydrateErrorType } from 'redux-persist'
import { BannerState } from './features/banner/types'
import { PlaceState } from './features/place/types'

export interface RootState {
  banner: BannerState
  place: PlaceState
}

export interface RehydrateAction {
  type: 'persist/REHYDRATE'
  key: string
  payload?: RootState | null
  err?: RehydrateErrorType | null
}
