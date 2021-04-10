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

export const loadAdministrativeAreasAction = (country: Place) => async (
  dispatch: Dispatch<PlaceActionTypes>
) => {
  const response = await api.getAdministrativeAreas(country.id)
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: LOAD_ADMINISTRATIVE_AREAS,
      payload: { countryId: country.id, administrativeAreas: response.data },
    })
  } else {
    dispatch({
      type: LOAD_ADMINISTRATIVE_AREAS_ERROR,
    })
  }
}
