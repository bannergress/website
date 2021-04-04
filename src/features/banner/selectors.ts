import { SystemState } from './types'

export const getBanner = (state: SystemState, id: string) =>
  state.banners.find((b) => b.id === id)
