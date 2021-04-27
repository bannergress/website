import { Dispatch } from 'redux'
import {
  PlaceActionTypes,
  LOAD_COUNTRIES,
  LOAD_COUNTRIES_ERROR,
  LOAD_ADMINISTRATIVE_AREAS,
  LOAD_ADMINISTRATIVE_AREAS_ERROR,
} from './actionTypes'
import * as api from './api'
import { Place } from './types'

export const loadCountriesAction = () => async (
  dispatch: Dispatch<PlaceActionTypes>
) => {
  const response = await api.getCountries()
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: LOAD_COUNTRIES,
      payload: response.data,
    })
  } else {
    dispatch({
      type: LOAD_COUNTRIES_ERROR,
    })
  }
}

export const loadAdministrativeAreasAction = (place: Partial<Place>) => async (
  dispatch: Dispatch<PlaceActionTypes>
) => {
  if (place.id) {
    const response = await api.getAdministrativeAreas(place.id)
    if (response.ok && response.data !== undefined) {
      dispatch({
        type: LOAD_ADMINISTRATIVE_AREAS,
        payload: { placeId: place.id, administrativeAreas: response.data },
      })
    } else {
      dispatch({
        type: LOAD_ADMINISTRATIVE_AREAS_ERROR,
      })
    }
  }
}
