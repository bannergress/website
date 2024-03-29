import { RootState } from '../../storeTypes'

export const getCountries = (state: RootState) => state.place.countries
export const getAdministrativeAreas = (
  state: RootState,
  parentPlaceId: string
) => state.place.administrativeAreas[parentPlaceId]

export const getPlace = (state: RootState, placeId: string) =>
  state.place.allPlaces[placeId]

export const getSearchPlaces = (state: RootState) => state.place.searchPlaces

export const getHasMoreSearchPlaces = (state: RootState) =>
  state.place.canSearchMore
