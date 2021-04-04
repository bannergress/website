import { LOAD_BANNER } from './actionTypes'
import bannerReducer from './bannerReducer'
import { BannerActionTypes } from './types'

describe('features > banner > bannerReducer', () => {
  it(`load banner, if ${LOAD_BANNER} action is provided`, () => {
    const initialState = {
      banners: [],
    }

    const expectedState = {
      banners: [{ id: '1' }],
    }

    const action: BannerActionTypes = {
      type: LOAD_BANNER,
      payload: { id: '1' },
    }

    expect(bannerReducer(initialState, action)).toEqual(expectedState)
  })
})
