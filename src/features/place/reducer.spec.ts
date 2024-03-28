import { describe, expect, it } from 'vitest'
import {
  PlaceActionTypes,
  LOAD_ADMINISTRATIVE_AREAS,
  LOAD_COUNTRIES,
} from './actionTypes'
import bannerReducer from './reducer'

describe('features > place > placeReducer', () => {
  it(`load countries, if ${LOAD_COUNTRIES} action is provided`, () => {
    const initialState = {
      allPlaces: [],
      countries: [],
      administrativeAreas: {},
      searchPlaces: [],
      canSearchMore: false,
    }

    const expectedState = {
      countries: [{ id: '1' }],
      administrativeAreas: {},
      allPlaces: { '1': { id: '1' } },
      canSearchMore: false,
      searchPlaces: [],
    }

    const action: PlaceActionTypes = {
      type: LOAD_COUNTRIES,
      payload: [{ id: '1' }],
    }

    expect(bannerReducer(initialState, action)).toEqual(expectedState)
  })
  it(`load administrative areas, if ${LOAD_ADMINISTRATIVE_AREAS} action is provided`, () => {
    const initialState = {
      allPlaces: [],
      countries: [],
      administrativeAreas: {},
      searchPlaces: [],
      canSearchMore: false,
    }

    const expectedState = {
      allPlaces: { '1': { id: '1' } },
      countries: [],
      administrativeAreas: { de: [{ id: '1' }] },
      searchPlaces: [],
      canSearchMore: false,
    }

    const action: PlaceActionTypes = {
      type: LOAD_ADMINISTRATIVE_AREAS,
      payload: { placeId: 'de', administrativeAreas: [{ id: '1' }] },
    }

    expect(bannerReducer(initialState, action)).toEqual(expectedState)
  })
})
