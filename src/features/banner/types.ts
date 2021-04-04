import { LOAD_BANNER } from './actionTypes'

interface LoadBannerAction {
  type: typeof LOAD_BANNER
  payload: Banner
}

export type BannerActionTypes = LoadBannerAction

export interface SystemState {
  banners: Banner[]
}

export interface Banner {
  id: string
}
