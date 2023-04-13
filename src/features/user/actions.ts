import { Dispatch } from 'redux'
import i18n from '../../i18n'
import {
  UserActionTypes,
  LOAD_USER,
  CLAIM_USER,
  VERIFY_USER,
  UNLINK_USER,
  ABORT_CLAIM_USER,
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
    throw new Error(
      i18n.t('account.errors.loadUser', {
        defaultValue: 'Error getting user info',
      })
    )
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
    throw new Error(
      i18n.t('account.linking.errors.claim', {
        defaultValue: 'Error claiming agent',
      })
    )
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
    throw new Error(
      i18n.t('account.linking.errors.verify', {
        defaultValue: 'Error verifying agent',
      })
    )
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
    throw new Error(
      i18n.t('account.linking.errors.unlink', {
        defaultValue: 'Error unlinking agent',
      })
    )
  }
}

export const abortClaimUser = (agent: string) => async (
  dispatch: Dispatch<UserActionTypes>
) => {
  const response = await api.abortClaimUser(agent)
  if (response.ok && response.data !== undefined) {
    dispatch({
      type: ABORT_CLAIM_USER,
      payload: response.data,
    })
  } else if (!response.ok) {
    throw new Error(
      i18n.t('account.linking.errors.abort', {
        defaultValue: 'Error aborting claim',
      })
    )
  }
}
