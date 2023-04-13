import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Trans } from 'react-i18next'

import LoginInNavbar from '../login-in-navbar'

import './login-required.less'

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
        <div className="login-required-initializing">
          <Trans i18nKey="loading">Loading...</Trans>
        </div>
      )}

      {authenticated && <>{children}</>}

      {notAuthenticated && (
        <>
          <div className="login-required">
            <div>
              <Trans i18nKey="login.required">
                You must sign in first to access this functionality.
              </Trans>
            </div>
            <LoginInNavbar />
          </div>
        </>
      )}
    </Fragment>
  )
}

export default LoginRequired
