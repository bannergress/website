import { NamedAgent } from '../mission/types'

export interface User {
  agent: NamedAgent
  verificationAgent: string
  verificationToken: string
}

export interface UserState {
  currentUser: User
}
