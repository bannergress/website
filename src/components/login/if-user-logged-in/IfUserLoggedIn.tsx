import React, { Fragment } from 'react'
import { useUserLoggedIn } from '../../../hooks/UserLoggedIn'

const IfUserLoggedIn: React.FC = (props) => {
  const userIsLoggedIn = useUserLoggedIn()
  const { children } = props

  return <Fragment>{userIsLoggedIn && <>{children}</>}</Fragment>
}

export default IfUserLoggedIn
