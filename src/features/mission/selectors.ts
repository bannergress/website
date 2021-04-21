import { RootState } from '../../storeTypes'

export const getMissions = (state: RootState) => state.missions.searchedMissions
export const getHasMoreSearchedMissions = (state: RootState) =>
  state.missions.canSearchMore
