import { BannerState } from './types'
import {
  BannerActionTypes,
  LOAD_BANNER,
  LOAD_RECENT_BANNERS,
} from './actionTypes'
import bannerReducer from './reducer'

describe('features > banner > bannerReducer', () => {
  it(`load banner, if ${LOAD_BANNER} action is provided`, () => {
    const initialState: BannerState = {
      banners: [],
      recentBanners: [],
      browsedBanners: [],
      searchBanners: [],
      canBrowseMore: true,
      canSearchMore: true,
    }

    const expectedState: BannerState = {
      banners: [
        {
          uuid: '1',
          title: 'Banner 1',
          numberOfMissions: 0,
          startLatitude: 0,
          startLongitude: 0,
          lengthMeters: 0,
          formattedAddress: '',
          picture: '',
        },
      ],
      recentBanners: [],
      browsedBanners: [],
      searchBanners: [],
      canBrowseMore: true,
      canSearchMore: true,
    }

    const action: BannerActionTypes = {
      type: LOAD_BANNER,
      payload: {
        uuid: '1',
        title: 'Banner 1',
        numberOfMissions: 0,
        startLatitude: 0,
        startLongitude: 0,
        lengthMeters: 0,
        formattedAddress: '',
        picture: '',
      },
    }

    expect(bannerReducer(initialState, action)).toEqual(expectedState)
  })
  it(`load recent banners, if ${LOAD_RECENT_BANNERS} action is provided`, () => {
    const initialState: BannerState = {
      banners: [],
      recentBanners: [],
      browsedBanners: [],
      searchBanners: [],
      canBrowseMore: true,
      canSearchMore: true,
    }

    const expectedState: BannerState = {
      banners: [],
      recentBanners: [
        {
          uuid: '1',
          title: 'Banner 1',
          numberOfMissions: 0,
          startLatitude: 0,
          startLongitude: 0,
          lengthMeters: 0,
          formattedAddress: '',
          picture: '',
        },
      ],
      browsedBanners: [],
      searchBanners: [],
      canBrowseMore: true,
      canSearchMore: true,
    }

    const action: BannerActionTypes = {
      type: LOAD_RECENT_BANNERS,
      payload: [
        {
          uuid: '1',
          title: 'Banner 1',
          numberOfMissions: 0,
          startLatitude: 0,
          startLongitude: 0,
          lengthMeters: 0,
          formattedAddress: '',
          picture: '',
        },
      ],
    }

    expect(bannerReducer(initialState, action)).toEqual(expectedState)
  })
})
