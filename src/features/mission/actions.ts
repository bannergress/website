import { Dispatch } from 'redux'
import { MissionActionTypes, SEARCH_MISSIONS } from './actionTypes'
import * as api from './api'

export const searchMissionsAction = (
  location: string,
  query: string,
  page: number
) => async (dispatch: Dispatch<MissionActionTypes>) => {
  const response = await api.searchMissions(location, query, page)
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: SEARCH_MISSIONS,
      payload: {
        missions: response.data,
        hasMore: response.data && response.data.length === api.PAGE_SIZE,
      },
    })
  } else if (!response.ok) {
    throw new Error('Error loading missions')
  }
}
