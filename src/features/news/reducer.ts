import { REHYDRATE } from 'redux-persist/es/constants'

import { NewsActionTypes, LOAD_NEWS } from './actionTypes'
import { NewsState } from './types'

const initialState: NewsState = {
  news: [],
}

export default (state = initialState, action: NewsActionTypes) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ...action.payload?.news,
      }
    case LOAD_NEWS:
      return {
        ...state,
        news: action.payload,
      }
    default:
      return state
  }
}
