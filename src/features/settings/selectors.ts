import { RootState } from '../../storeTypes'

export const getDefaultOnline = (state: RootState) =>
  state.settings.defaultOnline
export const getDefaultOrder = (state: RootState) => ({
  defaultOrderBy: state.settings.defaultOrderBy,
  defaultOrderDirection: state.settings.defaultOrderDirection,
  defaultProximityLatitude: state.settings.defaultProximityLatitude,
  defaultProximityLongitude: state.settings.defaultProximityLongitude,
})
