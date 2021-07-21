import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'

import './login-required.less'
import LoginInNavbar from '../login-in-navbar'

const LoginRequired: React.FC = (props) => {
  const { keycloak, initialized: keycloakInitialized } = useKeycloak()
  const { children } = props

  const initializing = !keycloakInitialized
  const authenticated =
    keycloakInitialized && keycloak && keycloak.authenticated
  const notAuthenticated =
    keycloakInitialized && keycloak && !keycloak.authenticated

  return (
    <Fragment>
      {initializing && (
        <div className="login-required-initializing">Loading...</div>
      )}

      {authenticated && <>{children}</>}

      {notAuthenticated && (
        <>
          <div className="login-required">
            <div>You must sign in first to access this functionality.</div>
            <LoginInNavbar />
          </div>
        </>
      )}
    </Fragment>
  )
}

export default LoginRequired
