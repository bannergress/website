import { REHYDRATE } from 'redux-persist/es/constants'
import {
  UserActionTypes,
  LOAD_USER,
  CLAIM_USER,
  VERIFY_USER,
  UNLINK_USER,
} from './actionTypes'

const initialState = {
  currentUser: {},
}

export default (state = initialState, action: UserActionTypes) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ...action.payload?.user,
      }
    case LOAD_USER:
    case CLAIM_USER:
    case VERIFY_USER:
    case UNLINK_USER:
      return {
        ...state,
        currentUser: action.payload,
      }
    default:
      return state
  }
}
