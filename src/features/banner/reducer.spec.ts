import {
  BannerActionTypes,
  LOAD_BANNER,
  LOAD_RECENT_BANNERS,
} from './actionTypes'
import bannerReducer from './reducer'

describe('features > banner > bannerReducer', () => {
  it(`load banner, if ${LOAD_BANNER} action is provided`, () => {
    const initialState = {
      banners: [],
      recentBanners: [],
    }

    const expectedState = {
      banners: [{ uuid: '1' }],
      recentBanners: [],
    }

    const action: BannerActionTypes = {
      type: LOAD_BANNER,
      payload: { uuid: '1' },
    }

    expect(bannerReducer(initialState, action)).toEqual(expectedState)
  })
  it(`load recent banners, if ${LOAD_RECENT_BANNERS} action is provided`, () => {
    const initialState = {
      banners: [],
      recentBanners: [],
    }

    const expectedState = {
      banners: [],
      recentBanners: [{ uuid: '1' }],
    }

    const action: BannerActionTypes = {
      type: LOAD_RECENT_BANNERS,
      payload: [{ uuid: '1' }],
    }

    expect(bannerReducer(initialState, action)).toEqual(expectedState)
  })
})
