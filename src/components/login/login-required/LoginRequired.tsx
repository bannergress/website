import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Trans, useTranslation } from 'react-i18next'

import LoginInNavbar from '../login-in-navbar'

import './login-required.less'

const LoginRequired: React.FC = (props) => {
  const { keycloak, initialized: keycloakInitialized } = useKeycloak()
  const { t } = useTranslation()
  const { children } = props

  const initializing = !keycloakInitialized
  const authenticated =
    keycloakInitialized && keycloak && keycloak.authenticated
  const notAuthenticated =
    keycloakInitialized && keycloak && !keycloak.authenticated

  return (
    <Fragment>
      {initializing && (
        <div className="login-required-initializing">{t('loading')}</div>
      )}

      {authenticated && <>{children}</>}

      {notAuthenticated && (
        <>
          <div className="login-required">
            <div>{t('login.required')}</div>
            <LoginInNavbar />
          </div>
        </>
      )}
    </Fragment>
  )
}

export default LoginRequired
