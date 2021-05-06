import { RehydrateAction } from '../../storeTypes'
import { Place } from './types'

export const LOAD_COUNTRIES = 'LOAD_COUNTRIES'
export const LOAD_COUNTRIES_ERROR = 'LOAD_COUNTRIES_ERROR'
export const LOAD_ADMINISTRATIVE_AREAS = 'LOAD_ADMINISTRATIVE_AREAS'
export const LOAD_ADMINISTRATIVE_AREAS_ERROR = 'LOAD_ADMINISTRATIVE_AREAS_ERROR'
export const LOAD_PLACE = 'LOAD_PLACE'
export const LOAD_PLACE_ERROR = 'LOAD_PLACE_ERROR'
export const SEARCH_PLACES = 'SEARCH_PLACES'

interface LoadCountriesAction {
  type: typeof LOAD_COUNTRIES
  payload: Array<Partial<Place>>
}

interface LoadCountriesErrorAction {
  type: typeof LOAD_COUNTRIES_ERROR
}

interface LoadAdministrativeAreasAction {
  type: typeof LOAD_ADMINISTRATIVE_AREAS
  payload: {
    placeId: string
    administrativeAreas: Array<Partial<Place>>
  }
}

interface LoadAdministrativeAreasErrorAction {
  type: typeof LOAD_ADMINISTRATIVE_AREAS_ERROR
}

interface LoadPlaceAction {
  type: typeof LOAD_PLACE
  payload: Partial<Place>
}

interface LoadPlaceErrorAction {
  type: typeof LOAD_PLACE_ERROR
}

interface SearchPlacesAction {
  type: typeof SEARCH_PLACES
  payload: {
    places: Array<Place>
  }
}

export type PlaceActionTypes =
  | LoadCountriesAction
  | LoadCountriesErrorAction
  | LoadAdministrativeAreasAction
  | LoadAdministrativeAreasErrorAction
  | LoadPlaceAction
  | LoadPlaceErrorAction
  | SearchPlacesAction
  | RehydrateAction
