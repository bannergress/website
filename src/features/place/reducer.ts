import { REHYDRATE } from 'redux-persist/es/constants'
import {
  PlaceActionTypes,
  LOAD_COUNTRIES,
  LOAD_COUNTRIES_ERROR,
  LOAD_ADMINISTRATIVE_AREAS,
  LOAD_ADMINISTRATIVE_AREAS_ERROR,
  LOAD_PLACE_ERROR,
  LOAD_PLACE,
} from './actionTypes'
import { Dictionary, Place } from './types'

const initialState = {
  allPlaces: {},
  countries: [],
  administrativeAreas: {},
}

function AddPlacesToDictionary(
  places: Partial<Place>[],
  dictionary: Dictionary<Partial<Place>>
) {
  const asDictionary = places.reduce<Dictionary<Partial<Place>>>(
    (accumulator, currentValue) => {
      accumulator[currentValue.id || ''] = currentValue
      return accumulator
    },
    {}
  )

  return {
    ...dictionary,
    ...asDictionary,
  }
}

function AddPlaceAndParentsToDictionary(
  place: Partial<Place>,
  dictionary: Dictionary<Partial<Place>>
) {
  let currentPlace = place
  const places = [currentPlace]
  while (currentPlace.parentPlace) {
    places.push(currentPlace.parentPlace)
    currentPlace.parentPlaceId = currentPlace.parentPlace.id
    currentPlace = currentPlace.parentPlace
  }

  return AddPlacesToDictionary(places, dictionary)
}

export default (state = initialState, action: PlaceActionTypes) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ...action.payload?.place,
      }
    case LOAD_COUNTRIES:
      return {
        ...state,
        countries: action.payload,
        allPlaces: AddPlacesToDictionary(action.payload, state.allPlaces),
      }
    case LOAD_ADMINISTRATIVE_AREAS:
      return {
        ...state,
        administrativeAreas: {
          ...state.administrativeAreas,
          [action.payload.placeId]: action.payload.administrativeAreas,
        },
        allPlaces: AddPlacesToDictionary(
          action.payload.administrativeAreas,
          state.allPlaces
        ),
      }
    case LOAD_PLACE:
      return {
        ...state,
        allPlaces: AddPlaceAndParentsToDictionary(
          action.payload,
          state.allPlaces
        ),
      }

    case LOAD_COUNTRIES_ERROR:
      return state
    case LOAD_ADMINISTRATIVE_AREAS_ERROR:
      return state
    case LOAD_PLACE_ERROR:
      return state
    default:
      return state
  }
}
