import { RootState } from '../../storeTypes'

export const getCurrentUser = (state: RootState) => state.user.currentUser
