import { LOAD_BANNER } from './actionTypes'

export const loadBannerAction = (id: string) => {
  return {
    type: LOAD_BANNER,
    payload: { id },
  }
}
