import { REHYDRATE } from 'redux-persist/es/constants'
import {
  PlaceActionTypes,
  LOAD_COUNTRIES,
  LOAD_COUNTRIES_ERROR,
  LOAD_ADMINISTRATIVE_AREAS,
  LOAD_ADMINISTRATIVE_AREAS_ERROR,
} from './actionTypes'

const initialState = {
  countries: [],
  administrativeAreas: {},
}

export default (state = initialState, action: PlaceActionTypes) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ...action.payload?.place,
      }
    case LOAD_COUNTRIES:
      return { ...state, countries: action.payload }
    case LOAD_ADMINISTRATIVE_AREAS:
      return {
        ...state,
        administrativeAreas: {
          ...state.administrativeAreas,
          [action.payload.placeId]: action.payload.administrativeAreas,
        },
      }
    case LOAD_COUNTRIES_ERROR:
      return state
    case LOAD_ADMINISTRATIVE_AREAS_ERROR:
      return state
    default:
      return state
  }
}
