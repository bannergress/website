import { describe, expect, it } from 'vitest'
import { MissionActionTypes, SEARCH_MISSIONS } from './actionTypes'
import missionReducer from './reducer'
import { MissionState } from './types'

describe('features > mission > reducer', () => {
  it(`search missions, if ${SEARCH_MISSIONS} action is provided`, () => {
    const initialState: MissionState = {
      searchedMissions: [],
      canSearchMore: true,
    }

    const expectedState: MissionState = {
      searchedMissions: [
        {
          id: '1',
          title: 'Mission 1',
          description: '',
          picture: '',
          status: 'published',
        },
      ],
      canSearchMore: true,
    }

    const action: MissionActionTypes = {
      type: SEARCH_MISSIONS,
      payload: {
        missions: [
          {
            id: '1',
            title: 'Mission 1',
            description: '',
            picture: '',
            status: 'published',
          },
        ],
        hasMore: true,
      },
    }

    expect(missionReducer(initialState, action)).toEqual(expectedState)
  })
})
