import React from 'react'
import { useUserLoggedIn } from '../hooks/UserLoggedIn'

export const withAuthenticated = (Component: any) => {
  return (props: any) => {
    const { authenticated, initialized } = useUserLoggedIn()
    return <Component authenticated={authenticated && initialized} {...props} />
  }
}
