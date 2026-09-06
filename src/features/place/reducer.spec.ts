import { describe, expect, it } from 'vitest'
import {
  PlaceActionTypes,
  LOAD_ADMINISTRATIVE_AREAS,
  LOAD_COUNTRIES,
} from './actionTypes'
import bannerReducer from './reducer'
import { Place } from './types'

const place: Place = {
  id: '1',
  formattedAddress: 'Germany',
  longName: 'Germany',
  shortName: 'DE',
  numberOfBanners: 0,
  boundaryMinLatitude: 47,
  boundaryMinLongitude: 5,
  boundaryMaxLatitude: 55,
  boundaryMaxLongitude: 15,
}

describe('features > place > placeReducer', () => {
  it(`load countries, if ${LOAD_COUNTRIES} action is provided`, () => {
    const initialState = {
      allPlaces: {},
      countries: [],
      administrativeAreas: {},
      searchPlaces: [],
      canSearchMore: false,
    }

    const expectedState = {
      countries: [place],
      administrativeAreas: {},
      allPlaces: { '1': place },
      canSearchMore: false,
      searchPlaces: [],
    }

    const action: PlaceActionTypes = {
      type: LOAD_COUNTRIES,
      payload: [place],
    }

    expect(bannerReducer(initialState, action)).toEqual(expectedState)
  })
  it(`load administrative areas, if ${LOAD_ADMINISTRATIVE_AREAS} action is provided`, () => {
    const initialState = {
      allPlaces: {},
      countries: [],
      administrativeAreas: {},
      searchPlaces: [],
      canSearchMore: false,
    }

    const expectedState = {
      allPlaces: { '1': place },
      countries: [],
      administrativeAreas: { de: [place] },
      searchPlaces: [],
      canSearchMore: false,
    }

    const action: PlaceActionTypes = {
      type: LOAD_ADMINISTRATIVE_AREAS,
      payload: { placeId: 'de', administrativeAreas: [place] },
    }

    expect(bannerReducer(initialState, action)).toEqual(expectedState)
  })
})
