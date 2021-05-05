import { Dispatch } from 'redux'
import {
  PlaceActionTypes,
  LOAD_COUNTRIES,
  LOAD_COUNTRIES_ERROR,
  LOAD_ADMINISTRATIVE_AREAS,
  LOAD_ADMINISTRATIVE_AREAS_ERROR,
  LOAD_PLACE,
  LOAD_PLACE_ERROR,
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

export const loadAdministrativeAreasAction = (parentPlaceId: string) => async (
  dispatch: Dispatch<PlaceActionTypes>
) => {
  const response = await api.getAdministrativeAreas(parentPlaceId)
  if (response.ok && response.data !== undefined) {
    // ammend the data with the parent place that was used in the query
    const ammendedData = response.data.map((p: Place) => ({
      ...p,
      parentPlaceId,
    }))

    dispatch({
      type: LOAD_ADMINISTRATIVE_AREAS,
      payload: { placeId: parentPlaceId, administrativeAreas: ammendedData },
    })
  } else {
    dispatch({
      type: LOAD_ADMINISTRATIVE_AREAS_ERROR,
    })
  }
}

export const loadPlaceAction = (placeId: string) => async (
  dispatch: Dispatch<PlaceActionTypes>
) => {
  const response = await api.getPlace(placeId)
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: LOAD_PLACE,
      payload: response.data,
    })
  } else {
    dispatch({
      type: LOAD_PLACE_ERROR,
    })
  }
}
