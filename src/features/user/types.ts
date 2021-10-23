export interface User {
  agent: string
  verificationAgent: string
  verificationToken: string
}

export interface UserState {
  currentUser: User
}
