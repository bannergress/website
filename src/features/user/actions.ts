import { Dispatch } from 'redux'
import {
  UserActionTypes,
  LOAD_USER,
  CLAIM_USER,
  VERIFY_USER,
  UNLINK_USER,
} from './actionTypes'
import * as api from './api'

export const loadCurrentUser = () => async (
  dispatch: Dispatch<UserActionTypes>
) => {
  const response = await api.getUser()
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: LOAD_USER,
      payload: response.data,
    })
  } else if (!response.ok) {
    throw new Error('Error getting user info')
  }
}

export const claimUser = (agent: string) => async (
  dispatch: Dispatch<UserActionTypes>
) => {
  const response = await api.claimUser(agent)
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: CLAIM_USER,
      payload: response.data,
    })
  } else if (!response.ok) {
    throw new Error('Error claiming agent')
  }
}

export const verifyUser = () => async (dispatch: Dispatch<UserActionTypes>) => {
  const response = await api.verifyUser()
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: VERIFY_USER,
      payload: response.data,
    })
  } else if (!response.ok) {
    throw new Error('Error verifying agent')
  }
}

export const unlinkUser = () => async (dispatch: Dispatch<UserActionTypes>) => {
  const response = await api.unlinkUser()
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: UNLINK_USER,
      payload: response.data,
    })
  } else if (!response.ok) {
    throw new Error('Error unlinking agent')
  }
}
