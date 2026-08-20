import { NamedAgent } from '../mission/types'

export interface User {
  agent?: NamedAgent
  verificationAgent?: string
  verificationMessage?: string
}
