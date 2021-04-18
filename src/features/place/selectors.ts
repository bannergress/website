import { RootState } from '../../storeTypes'
import { Place } from './types'

export const getCountries = (state: RootState) => state.place.countries
export const getAdministrativeAreas = (state: RootState, place: Place) =>
  state.place.administrativeAreas[place.id]
