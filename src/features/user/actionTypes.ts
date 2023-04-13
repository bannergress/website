import { RehydrateAction } from '../../storeTypes'
import { User } from './types'

export const LOAD_USER = 'LOAD_USER'
export const CLAIM_USER = 'CLAIM_USER'
export const VERIFY_USER = 'VERIFY_USER'
export const UNLINK_USER = 'UNLINK_USER'
export const ABORT_CLAIM_USER = 'ABORT_CLAIM_USER'

interface LoadUserAction {
  type: typeof LOAD_USER
  payload: Partial<User>
}

interface ClaimUserAction {
  type: typeof CLAIM_USER
  payload: Partial<User>
}

interface VerifyUserAction {
  type: typeof VERIFY_USER
  payload: Partial<User>
}

interface UnlinkUserAction {
  type: typeof UNLINK_USER
  payload: Partial<User>
}

interface AbortClaimUserAction {
  type: typeof ABORT_CLAIM_USER
  payload: Partial<User>
}

export type UserActionTypes =
  | LoadUserAction
  | ClaimUserAction
  | VerifyUserAction
  | UnlinkUserAction
  | AbortClaimUserAction
  | RehydrateAction
