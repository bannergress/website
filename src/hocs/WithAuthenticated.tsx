import React from 'react'
import { useUserLoggedIn } from '../hooks/UserLoggedIn'

export const withAuthenticated = <P extends { authenticated: boolean }>(
  Component: React.ComponentType<P>
) => {
  return (props: Omit<P, 'authenticated'>) => {
    const { authenticated, initialized } = useUserLoggedIn()
    return (
      <Component
        {...(props as P)}
        authenticated={authenticated && initialized}
      />
    )
  }
}
