import React, { Fragment } from 'react'

import { useUserLoggedIn } from '../../../hooks/UserLoggedIn'

const IfUserLoggedIn: React.FC<IfUserLoggedInProps> = (props) => {
  const { authenticated } = useUserLoggedIn()
  const { children } = props

  return <Fragment>{authenticated && <>{children}</>}</Fragment>
}

export interface IfUserLoggedInProps {
  children: React.ReactNode
}

export default IfUserLoggedIn
