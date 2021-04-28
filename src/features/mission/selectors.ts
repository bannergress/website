import { RootState } from '../../storeTypes'

export const getMissions = (state: RootState) => state.mission.searchedMissions
export const getHasMoreSearchedMissions = (state: RootState) =>
  state.mission.canSearchMore
