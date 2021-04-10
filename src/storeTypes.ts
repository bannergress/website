import { RehydrateErrorType } from 'redux-persist'
import { BannerState } from './features/banner/types'

export interface RootState {
  banner: BannerState
}

export interface RehydrateAction {
  type: 'persist/REHYDRATE'
  key: string
  payload?: RootState | null
  err?: RehydrateErrorType | null
}
