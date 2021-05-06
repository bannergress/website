import { Dispatch } from 'redux'
import { NewsActionTypes, LOAD_NEWS } from './actionTypes'
import * as api from './api'

export const loadNewsAction = () => async (
  dispatch: Dispatch<NewsActionTypes>
) => {
  const response = await api.getNews()
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: LOAD_NEWS,
      payload: response.data,
    })
  } else if (!response.ok) {
    throw new Error('Error loading missions')
  }
}
