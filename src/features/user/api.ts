import { api } from '../../api'
import { User } from './types'

export const getUser = () => api.get<User>('user')

export const claimUser = (agent: string) =>
  api.post<User>(`user/claim?agent=${agent}`)

export const unlinkUser = () => api.post<User>('user/unlink')

export const abortClaimUser = () => api.delete<User>(`user/claim`)
