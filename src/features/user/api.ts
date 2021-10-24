import { api } from '../../api'
import { User } from './types'

const isMock = process.env.REACT_APP_USE_MOCK === 'true'

export const getUser = () =>
  isMock ? { data: {}, ok: true, status: 200 } : api.get<User>('user')

export const claimUser = (agent: string) =>
  isMock
    ? {
        data: {
          verificationAgent: 'mock',
          verificationToken: 'some-random-string',
        },
        ok: true,
        status: 200,
      }
    : api.post<User>(`user/claim?agent=${agent}`)

export const verifyUser = () =>
  isMock
    ? {
        data: <Partial<User>>{
          agent: { name: 'mock', faction: 'enlightened' },
        },
        ok: true,
        status: 200,
      }
    : api.post<User>('user/verify')

export const unlinkUser = () =>
  isMock ? { data: {}, ok: true, status: 200 } : api.post<User>('user/unlink')
