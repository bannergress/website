import React, { Fragment } from 'react'

import { useUserLoggedIn } from '../../../hooks/UserLoggedIn'

const IfUserLoggedIn: React.FC = (props) => {
  const [authenticated] = useUserLoggedIn()
  const { children } = props

  return <Fragment>{authenticated && <>{children}</>}</Fragment>
}

export default IfUserLoggedIn
