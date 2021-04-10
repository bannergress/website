import { RootState } from '../../storeTypes'
import { Place } from './types'

export const getCountries = (state: RootState) => state.place.countries
export const getAdministrativeAreas = (state: RootState, country: Place) =>
  state.place.administrativeAreas[country.id]
